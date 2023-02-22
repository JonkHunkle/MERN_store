import gql from "graphql-tag"

const  typeDefs = gql`
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

type Query{
    product(ID:ID!): Product!
    getProducts: [Product]
}

type Subscription {
    productAdded: Product
}

type Mutation {
    createProduct(productInput : ProductInput): Product!
    deleteProduct(id:ID!):Boolean
    editProduct(id:ID!, productInput: ProductInput!): Product
}
`
export default typeDefs
