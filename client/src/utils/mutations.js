import {gql} from '@apollo/client'

export const CREATE_PRODUCT = gql`
  mutation createProduct($productInput: ProductInput) {
    createProduct(productInput:$productInput) {
        _id
        name
        type
        quantity
        onHold
    }
  }
`;
export const EDIT_PRODUCT= gql`
  mutation editProduct($id:ID!, $productInput: ProductInput!) {
    editProduct(id:$id, productInput:$productInput) {
        _id
        name
        type
        quantity
        onHold
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: ID!) {
    deleteProduct(id:$id)
  }
`;
export const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id:$id)
  }
`;

