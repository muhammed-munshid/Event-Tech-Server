import mongoose from "mongoose";

const connection = ()=>{
    mongoose.connect('mongodb+srv://munshid:munshid123@cluster0.fyiocsw.mongodb.net/event-tech?retryWrites=true&w=majority')
    // mongoose.connect('mongodb://0.0.0.0:27017/eventTech')
}
mongoose.set('strictQuery', true);

export default connection