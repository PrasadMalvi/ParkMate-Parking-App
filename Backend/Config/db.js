const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connection Successfull ${mongoose.connection.host}`.bgBlue.white)
    } catch (error) {
        console.log(`Error in Connection database ${error}`.bgRed.white)
    }
}

module.exports = connectDB