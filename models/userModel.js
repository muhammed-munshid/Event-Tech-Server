import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    profile_image: {
        type:Array
    },
    password: {
        type: String,
        required: true
    },
})


const userModel = mongoose.model('users', userSchema)
export default userModel