import mongoose from 'mongoose'
const Objectid = mongoose.Types.ObjectId

const cartSchema=new mongoose.Schema({
    user_id:{
        type:Objectid
    },
    categories: {
        type:Array
    }
})


const cartModel = mongoose.model('carts',cartSchema)
export default cartModel