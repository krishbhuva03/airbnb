const { MongoClient } = require('mongodb');

console.log('Starting MongoDB connection test...');

const uri = "mongodb+srv://bhuvakrish03:Kr%21shBhuva2003@airbnb.l4jso6f.mongodb.net/?retryWrites=true&w=majority&appName=airbnb";
console.log('Using connection string:', uri);

const client = new MongoClient(uri);

client.connect()
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        return client.close();
    })
    .then(() => {
        console.log('Connection closed.');
    })
    .catch(error => {
        console.log('Error connecting to MongoDB:');
        console.log(error);
    });
