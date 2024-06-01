import Product from "../models/Product.js"
import User from "../models/User.js"
import { PubSub } from 'graphql-subscriptions';
import * as auth from '../utils/auth.js'
const pubsub = new PubSub();

export default {
    Query:{
        users: async () => {
            return await User.find();
          },
        async user(  _, {ID}){
            return await User.findById(ID)
        },
        async product(  _, {ID}){
            return await Product.findById(ID)
        },
        async products(){
            return await Product.find()
        }
    },
    Mutation:{
        addUser: async (parent, { userName, email, password }) => {
            const user = await User.create({ userName, email, password });
            const token = auth.signToken(user);
            return {token,user};
        },
        async deleteAllUsers(){
            const wasDeleted = (await User.deleteMany()).deletedCount
            return wasDeleted
            },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = auth.signToken(user);
            return { token, user };
        },
        async createProduct(_, {productInput}){
            const newProduct= await Product.create({...productInput, onHold:false})
            pubsub.publish('PRODUCT_ADDED', {productAdded:newProduct})
            return newProduct
        },
        async deleteProduct(_,{id}){
            const wasDeleted = (await Product.deleteOne({_id:id})).deletedCount
            return wasDeleted
            },
        async deleteAllProducts(){
            const wasDeleted = (await Product.deleteMany()).deletedCount
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