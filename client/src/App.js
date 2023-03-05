import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import React from 'react';
import ProductComponent from './components/ProductComponent';
import StoreProvider from './utils/StoreContext';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';


// import { getMainDefinition } from '@apollo/client/utilities';
// import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
// import { createClient } from 'graphql-ws';

const httpLink = new createHttpLink({
  uri: 'https://antique-store-backend.onrender.com/'
});

// const wsLink = new GraphQLWsLink(createClient({
//   uri: 'ws://localhost:3001/graphql'
// }));

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition?.kind === 'OperationDefinition' &&
//       definition?.operation === 'subscription'
//     );
//   },
//   wsLink,
//   httpLink,
// );

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}> 
    <StoreProvider>
      <Router>
        <Routes>
          <Route exact path='/' element = {<ProductComponent/>} />
        </Routes>
      </Router>
    </StoreProvider>
    </ApolloProvider>
  );
}
