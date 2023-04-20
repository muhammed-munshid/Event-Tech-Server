import mongoose from 'mongoose'
const Objectid = mongoose.Types.ObjectId

const formSchema = new mongoose.Schema({
    user_id: {
        type: Objectid,
        required: true
    },
    form: 
        [{
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
            company: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
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
            pin: {
                type: Number,
                required: true
            },
            place: {
                type: String,
                required: true
            }
        }]
})


const formModel = mongoose.model('form', formSchema)
export default formModel