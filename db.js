const mongoose= require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
//const connectDb=require("connectDb")

const connectDb =async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("connected to mongodb");

    }catch(error){
        console.log(error);
    }
};
//exports.connectDb = connectDb;
module.exports = {connectDb};
