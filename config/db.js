const mongoose = require('mongoose')
const colors = require('colors')

const MONGO_URI = process.env.MONGO_URI;
const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(MONGO_URI,{
           
            
        });
        console.log(`MongoDB Connected  😎😎😎 !!!`.blue.bold)

    }catch(error){
          console.log(`Error : ${error.message}`);
          process.exit(1);
    }
}

module.exports = connectDB

