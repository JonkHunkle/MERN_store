import { ApolloClient, InMemoryCache, ApolloProvider,split, HttpLink } from '@apollo/client';
import React from 'react';
import ProductComponent from './components/ProductComponent';
// Importing our theme provider which will make our global state available to child components
import StoreProvider from './utils/StoreContext';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const httpLink =  '/graphql'




const wsLink = new GraphQLWsLink(createClient({
  uri: '/graphql'
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
  link: '/graphql',
  cache: new InMemoryCache(),
});


export default function App() {
  

  return (
    <ApolloProvider client={client}> 
    <StoreProvider>
      <ProductComponent/>
    </StoreProvider>
    </ApolloProvider>
  );
}
