import { gql } from '@apollo/client';

export const QUERY_PRODUCTS = gql`
  {
    getProducts {
      _id
      name
      quantity
      type
      onHold
      }
  }
`;

export const PRODUCTS_SUBSCRIPTION = gql`
  subscription {
    productAdded {
      _id
      name
      quantity
      type
      onHold
  }
}
`;