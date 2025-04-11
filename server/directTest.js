const mongoose = require('mongoose');

const mongoUrl = "mongodb+srv://bhuvakrish03:Kr%21shBhuva2003@airbnb.l4jso6f.mongodb.net/?retryWrites=true&w=majority&appName=airbnb";

console.log('Attempting to connect to MongoDB...');
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('Connection closed.');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
