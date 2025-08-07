const mongoose = require("mongoose");
const seedAdmin = require("../helpers/seedAdmin");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // create admin
    await seedAdmin();

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;