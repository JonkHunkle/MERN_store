import { ApolloClient, InMemoryCache, ApolloProvider,split, HttpLink } from '@apollo/client';
import React, { useEffect } from 'react';
import ProductComponent from './components/ProductComponent';
// Importing our theme provider which will make our global state available to child components
import StoreProvider from './utils/StoreContext';

import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
  uri: 'http://localhost:3001/graphql'
});



const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:3001/graphql',
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition?.kind === 'OperationDefinition' &&
      definition?.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);


const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});


export default function App() {
  useEffect(() => {
    document.title = "Anne's Antiques";
  }, []);

  return (
    <ApolloProvider client={client}> 
    <StoreProvider>
      <ProductComponent />
    </StoreProvider>
    </ApolloProvider>
  );
}
