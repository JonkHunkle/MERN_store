import express from 'express';
import {expressMiddleware} from "@apollo/server/express4"
import cors from 'cors'
import bodyParser from 'body-parser'
import { ApolloServer} from '@apollo/server';
import  typeDefs from './schemas/typeDefs.js';
import resolvers  from './schemas/resolvers.js';
import db from './config/connection.js';

import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
  csrfPrevention:false,
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


app.use(
cors({
  origin:'*'
}),
bodyParser.json(),
expressMiddleware(server)
)
if (process.env.NODE_ENV === 'production'){
  app.use((express.static(path.join(__dirname, '../client/build'))))
}

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
});