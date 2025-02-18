FROM ubuntu:22.04
WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl nano nginx nodejs npm \
    lsb-release gpg

ENV NVM_DIR=/root/.nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash && \
    . "$NVM_DIR/nvm.sh" && \
    nvm install 22 && \
    nvm use 22 && \
    nvm alias default 22
    
ENV PATH="$NVM_DIR/versions/node/v22.13.1/bin:$PATH"

COPY package.json ./
RUN npm install
COPY . .

RUN useradd -m -s /bin/rbash rruser && \
    mkdir /home/rruser/allowed_commands && \
    echo 'export PATH=/home/rruser/allowed_commands' >> /home/rruser/.bash_profile && \
    chown -R rruser:rruser /home/rruser && \
    chmod 755 /home/rruser/allowed_commands && \
    chmod 644 /home/rruser/.bash_profile && \
    cp /bin/ls /home/rruser/allowed_commands/ && \
    cp /bin/node /home/rruser/allowed_commands/ && \
    cp /bin/cat /home/rruser/allowed_commands/ && \
    cp /bin/ncat /home/rruser/allowed_commands/ && \
    cp /bin/uname /home/rruser/allowed_commands/ && \
    cp /bin/awk /home/rruser/allowed_commands/ && \
    cp /bin/sort /home/rruser/allowed_commands/ && \
    cp /bin/find /home/rruser/allowed_commands/ && \
    cp /bin/sed /home/rruser/allowed_commands/ && \
    cp /bin/tail /home/rruser/allowed_commands/ && \
    cp /bin/head /home/rruser/allowed_commands/ && \
    cp /bin/grep /home/rruser/allowed_commands/ && \
    cp /bin/tr /home/rruser/allowed_commands/

RUN cp -r /root/.nvm /home/rruser/.nvm && \
    chown -R rruser:rruser /home/rruser/.nvm && \
    echo 'export NVM_DIR="/home/rruser/.nvm"' >> /home/rruser/.bash_profile && \
    echo 'source $NVM_DIR/nvm.sh' >> /home/rruser/.bash_profile && \
    echo 'nvm use 22' >> /home/rruser/.bash_profile && \
    echo 'export PATH="$NVM_DIR/versions/node/v22.13.1/bin:$PATH"' >> /home/rruser/.bash_profile && \
    chown -R rruser:rruser /home/rruser/.bash_profile

EXPOSE 1-65535
CMD service redis-server start && \
    service nginx start && \
    pm2 start server2.js --no-daemon

