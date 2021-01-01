require('dotenv').config();
const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const getPostModel = require('./model/postModel');
const userModel = require('./model/userModel');
const cors = require('cors');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs');
const { verifyToken } = require('./utils');
const PORT = process.env.SERVER_PORT || 5001;
const DB_URL = process.env.DB_URL;

const STATIC_FILE_PATH = path.join(__dirname, '../../dist');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const bearer = req.headers.authorization;

    if (!bearer)
      return {
        model: {
          post: getPostModel(),
          user: userModel,
        },
      };

    let token = bearer.split('Bearer ')[1] || '';
    token = token.trim();
    const currentUser = await verifyToken(token)
      .then(({ id }) => userModel.get(id))
      .catch((e) => {
        console.log(e.message);
        return null;
      });

    return {
      model: {
        post: getPostModel(currentUser), // give currentUser to postModel
        user: userModel,
      },
      currentUser,
    };
  },
});

const app = express();
app.use(cors());
app.get('*', function (req, res) {
  // graphql request is POST, no need to handle here.

  const { path } = req;
  console.log('\n\nreq.path %s\n\n', path);

  if (path.includes('.')) {
    const filename = path.split('/').slice(-1)[0];
    console.log('\n\nhandle specific file request %s\n\n', path);
    res.sendFile(STATIC_FILE_PATH + '/' + filename);
  } else {
    console.log('\n\nhandle other paths, serve index.html %s\n\n', path);
    res.sendFile(STATIC_FILE_PATH + '/index.html');
  }
});

server.applyMiddleware({ app });

const start = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();
