import express from 'express';
import {expressMiddleware} from "@apollo/server/express4"
import cors from 'cors'
import bodyParser from 'body-parser'
import { ApolloServer} from '@apollo/server';
import  typeDefs from './schemas/typeDefs.js';
import resolvers  from './schemas/resolvers.js';
import db from './config/connection.js';
import path from 'path';

import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const PORT = process.env.PORT || 3001;

const app = express();

const httpServer = createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});


const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
  ApolloServerPluginDrainHttpServer({ httpServer }),
  {
    async serverWillStart() {
      return {
        async drainServer() {
          await serverCleanup.dispose();
        },
      };
    },
  },
],
});

await server.start()



app.use('/graphql',
cors({
  origin:'*',
}),
bodyParser.json(),
expressMiddleware(server)
)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


if(process.env.NODE_ENV==='production'){
  const __dirname = path.resolve(path.dirname(''))
  app.use(express.static(path.join(__dirname, '../client/build')))
}

app.get('*', (req, res)=>{
  const __dirname = path.resolve(path.dirname(''))
  res.sendFile(path.join(__dirname, '../client/build'))
})

db.once('open', () => {

  httpServer.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
});