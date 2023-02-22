import Product from "../models/Product.js"
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export default {
    Query:{
        async product(  _, {ID}){
            return await Product.findById(ID)
        },
        async getProducts(){
            return await Product.find()
        }
    },
    Mutation:{
        async createProduct(_, {productInput}){
            const newProduct= await Product.create({...productInput, onHold:false})
            pubsub.publish('PRODUCT_ADDED', {productAdded:newProduct})
            return newProduct
        },
        async deleteProduct(_,{id}){
            const wasDeleted = (await Product.deleteOne({_id:id})).deletedCount
            return wasDeleted
            },
        async editProduct(_,{id, productInput}){
            const wasUpdated = await Product.updateOne({_id:id}, {$set:productInput}, {new:true})
            return wasUpdated
            }
        
    },
    Subscription:{
            productAdded :{
            subscribe: async ()=> pubsub.asyncIterator(['PRODUCT_ADDED'])
        }
    }
}