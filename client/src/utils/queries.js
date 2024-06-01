import { gql } from '@apollo/client';

export const QUERY_PRODUCTS = gql`
  {
    products {
      _id
      name
      quantity
      type
      onHold
      }
  }
`;

export const QUERY_PRODUCT = gql`
  {
    product(productId: $productId) {
        S_id
        name
        quantity
        type
        onHold
    }
  }
`;

// export const QUERY_USERS = gql`
//   {
//     user {
//       _id
//       name
//       quantity
//       type
//       onHold
//       }
//   }
// `;
// export const QUERY_USER = gql`
//   {
//     users {
//       _id
//       name
//       quantity
//       type
//       onHold
//       }
//   }
// `;

// ~~~REFACTOR~~~ add subscription directory and move this
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