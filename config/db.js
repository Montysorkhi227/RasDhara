const mongoose = require("mongoose")
const colors = require("colors")

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected to DB");
        
    } catch (error) {
        console.log('error in connecting database'.bgRed);
        
    }
}

module.exports = connectDB;