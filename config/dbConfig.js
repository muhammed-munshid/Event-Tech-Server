const mongoose=require('mongoose')

mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection;

connection.on('connected',()=>{
    console.log('MnogoDB Connection is Successfull');
})

connection.on('error',(error)=>{
    console.log('Error in MongoDB Connection',error);
})


module.exports=mongoose