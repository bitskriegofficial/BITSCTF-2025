const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const { ApolloServer, gql } = require('apollo-server-express');
const { graphqlUploadExpress, GraphQLUpload } = require('graphql-upload');
const fs = require('fs');
const path = require('path');
const { exec ,execSync} = require('child_process');
const { createClient } = require("redis");
const protobuf = require("protobufjs");
const app = express();
const mysql = require('mysql'); 
require('dotenv').config();


app.use(express.static('public'));
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.PASS, 
    database: process.env.DB 
  });

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test_db',
    charset: 'utf8mb4_unicode_ci',
    timezone: 'Z'
});

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    path: String!
  }

  type Query {
    _empty: String
  }

  type Mutation {
    uploadFile(file: Upload!, filename: String!): File!
  }
`;
const UPLOAD_DIR = path.join(__dirname, 'uploads');

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    _empty: () => 'Hello World',
  },
  Mutation: {
    uploadFile: async (_, { file, filename }) => {
      const { createReadStream, mimetype, encoding } = await file;
      const filePath = path.join(UPLOAD_DIR, filename);
      if (fs.existsSync(filePath)) {
         console.log("File Exists")
      }
      else {
      await new Promise((resolve, reject) => {
        createReadStream()
          .pipe(fs.createWriteStream(filePath))
          .on('finish', resolve)
          .on('error', reject);
      });}

      return { filename, mimetype, encoding, path: filePath };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

app.use(graphqlUploadExpress({ maxFileSize: 100000, maxFiles: 10 }));

async function datatosend() {
    const root = await protobuf.load("user.proto");
    const User = root.lookupType(process.env.LOOKUPTYPE);
    
    const connecttoconnect = createClient({
        hostname: 'localhost',
        port: 6379
    });
    await connecttoconnect.connect();

    const payload = { id: "12" } // };
    const message = User.create(payload);
    const buffer = User.encode(message).finish();

    await connecttoconnect.set(`user:${payload.id}`, buffer);
    await connecttoconnect.quit();
}

// datatosend().catch(console.error);

const redis = createClient();
async function storeSchema() {
    await redis.connect();
    const schemaContent = fs.readFileSync("user.proto", "utf8");
    await redis.set(`"proto:"${process.env.NEWNAME}`, schemaContent);
    await redis.quit();
}

// storeSchema();

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    // const sanitizedUsername = username.replace(/[;=-()]/g, '');
    // const sanitizedPassword = password.replace(/[;=-()]/g, '');
    const allowedChars = /^[a-zA-Z0-9@#$%^&+=]*$/;

    
    try {
        if ( username == process.env.USERNAME && password == process.env.PASSWORD){
 res.send({message:process.env.FLAG})}

        else {
            res.status(404).json ({message: 'User Not Found '})
        }
    } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use(express.static(path.join(__dirname, 'public')));
  console.log(path.join(__dirname, 'public'));
  app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

  app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
  });
server.start().then(() => {
  server.applyMiddleware({ app });
  app.use('/upload', graphqlHTTP({ resolvers, graphiql: true }));

  app.get('/execute', (req, res) => {
    const file = req.query.file;
    if (!file) {
      return res.status(400).send('Missing file parameter');
    }
    const execPath = path.join(UPLOAD_DIR, file);
    exec(`su - rruser -c "node ${execPath}"`, (error, stdout, stderr) => {
      if (error) {
        try {
                execSync(`rm ${execPath}`);  
            } catch (rmError) {
                console.error(`Failed to delete ${execPath}:`, rmError);
            }
        console.log(error)
        return res.status(500).send(`Error`);
      }
      if (stderr) {
        console.log(stderr)
         try {
                execSync(`rm ${execPath}`);  
            } catch (rmError) {
                console.error(`Failed to delete ${execPath}:`, rmError);
            }
        return res.status(500).send(`Error`);
      }
      console.log(stdout);
      try {
                execSync(`rm ${execPath}`);  
            } catch (rmError) {
                console.error(`Failed to delete ${execPath}:`, rmError);
            }
      return res.status(200).send(stdout);
    });
  });
  const PORT = 7000;
  app.listen(PORT, () => {});
});

