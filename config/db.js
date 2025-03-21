import mongoose from "mongoose";

const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          console.log('MongoDB Connected...');
    } catch (error) {
        console.log('Error in Connecting DBs: ',error);
    }
}

module.exports = connectDB;