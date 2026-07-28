const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  console.log("MONGO_URI =", mongoUri);

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ REAL MONGODB ERROR:");
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
