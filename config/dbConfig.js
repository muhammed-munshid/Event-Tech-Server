import mongoose from "mongoose";

const connection = ()=>{
    mongoose.connect('mongodb://0.0.0.0:27017/vutumi4')
}
mongoose.set('strictQuery', true);

export default connection