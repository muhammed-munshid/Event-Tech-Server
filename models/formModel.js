import mongoose from 'mongoose'
const Objectid = mongoose.Types.ObjectId

const formSchema = new mongoose.Schema({
    user_id: {
        type: Objectid
    },
    form: 
        [{
            order_id: {
                type:String
            },
            formName: {
                type: String,
                required: true
            },
            formEmail: {
                type: String,
                required: true
            },
            formMobile: {
                type: Number,
                required: true
            },
            address: {
                type:String
            },
            pin: {
                type: Number,
                required: true
            },
            state: {
                type:String
            },
            district: {
                type:String
            },
            place: {
                type: String,
                required: true
            },
            totalAmount: {
                type:Number
            },
            totalPrice: {
                type:Number
            },
            event_date: {
                type: Date,
                required: true
            },
            date: {
                type: Date
            },
            time: {
                type: String,
                required: true
            },
            count: {
                type: Number,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            items: {
                type:Array
            },
            status: {
                type:String
            }
        }]
})


const formModel = mongoose.model('form', formSchema)
export default formModel