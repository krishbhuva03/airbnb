import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('MongoDB URL:', process.env.MONGODB_URL);

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Successfully connected to MongoDB Atlas!');
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

testConnection();
