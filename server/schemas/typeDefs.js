import gql from "graphql-tag"

const  typeDefs = gql`
type User {
    _id: ID
    userName: String
    email: String
    password: String
}


type Product{
    _id:ID
    name:String
    type: String
    quantity:Int
    onHold:Boolean
}

input ProductInput{
    name:String
    type: String
    quantity:Int
    onHold:Boolean
}

type Auth {
    token: ID!
    user: User
  }


type Query{
    users: [User]
    user(ID:ID!): User
    product(ID:ID!): Product!
    products: [Product]
}

type Subscription {
    productAdded: Product
}

type Mutation {
    addUser(userName: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    createProduct(productInput : ProductInput): Product!
    deleteProduct(id:ID!):Boolean
    deleteAllUsers:Int
    deleteAllProducts:Int
    editProduct(id:ID!, productInput: ProductInput!): Product
}
`
export default typeDefs
