import mongoose from "mongoose";

// ✅ Connect to MongoDB using only MONGO_URL from .env
const connectdb = async () => {
  try {
    // 🔹 variable renamed to 'instance' for clarity
    const instance = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,       // Recommended by Mongoose
      useUnifiedTopology: true,    // Recommended by Mongoose
    });

    // 🔹 Fixed newline in console
    console.log(`\nMongoDB connected !! DB Host: ${instance.connection.host}`);
  } catch (error) {
    console.log(`Error while connecting to db: ${error.message}`);
    process.exit(1); // Exit if DB connection fails
  }
};

export default connectdb;
