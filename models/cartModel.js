import mongoose from 'mongoose'
const Objectid = mongoose.Types.ObjectId

const cartSchema=new mongoose.Schema({
    user_id:{
        type:Objectid
    },
    categories: {
        type:Array
    }
    // starters: [{
    //     category_image:{
    //         type:Array
    //     },
    //     category_name:{
    //         type:String
    //     },
    //     category_price:{
    //         type:Number
    //     },
    //     status: {
    //         type:Boolean,
    //         default:false
    //     }
    // }],
    // mains: [{
    //     category_image:{
    //         type:Array
    //     },
    //     category_name:{
    //         type:String
    //     },
    //     category_price:{
    //         type:Number
    //     },
    //     status: {
    //         type:Boolean,
    //         default:false
    //     }
    // }],
    // desserts: [{
    //     category_image:{
    //         type:Array
    //     },
    //     category_name:{
    //         type:String
    //     },
    //     category_price:{
    //         type:Number
    //     },
    //     status: {
    //         type:Boolean,
    //         default:false
    //     }
    // }],
    // salads: [{
    //     category_image:{
    //         type:Array
    //     },
    //     category_name:{
    //         type:String
    //     },
    //     category_price:{
    //         type:Number
    //     },
    //     status: {
    //         type:Boolean,
    //         default:false
    //     }
    // }],
    // stages: [{
    //     category_image:{
    //         type:Array
    //     },
    //     category_name:{
    //         type:String
    //     },
    //     category_price:{
    //         type:Number
    //     },
    //     status: {
    //         type:Boolean,
    //         default:false
    //     }
    // }],
    // decorates: [{
    //     category_image:{
    //         type:Array
    //     },
    //     category_name:{
    //         type:String
    //     },
    //     category_price:{
    //         type:Number
    //     },
    //     status: {
    //         type:Boolean,
    //         default:false
    //     }
    // }],
    // photos: [{
    //     category_image:{
    //         type:Array
    //     },
    //     category_name:{
    //         type:String
    //     },
    //     category_price:{
    //         type:Number
    //     },
    //     status: {
    //         type:Boolean,
    //         default:false
    //     }
    // }],
    // vehicles: [{
    //     category_image:{
    //         type:Array
    //     },
    //     category_name:{
    //         type:String
    //     },
    //     category_price:{
    //         type:Number
    //     },
    //     status: {
    //         type:Boolean,
    //         default:false
    //     }
    // }]
})


const cartModel = mongoose.model('carts',cartSchema)
export default cartModel