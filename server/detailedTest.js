const mongoose = require('mongoose');

const mongoUrl = "mongodb+srv://bhuvakrish03:Kr%21shBhuva2003@airbnb.l4jso6f.mongodb.net/?retryWrites=true&w=majority&appName=airbnb";

async function testConnection() {
    try {
        console.log('Attempting to connect with URL:', mongoUrl);
        
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // 5 second timeout
        };
        
        await mongoose.connect(mongoUrl, options);
        console.log('✓ Successfully connected to MongoDB Atlas');
        
        // Try to list databases to verify full access
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log('✓ Can list databases:', dbs.databases.map(db => db.name));
        
        await mongoose.connection.close();
        console.log('✓ Connection closed successfully');
    } catch (error) {
        console.error('× Connection failed with error:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.code) console.error('Error code:', error.code);
        
        // Check specific error types
        if (error.name === 'MongoServerSelectionError') {
            console.log('\nPossible issues:');
            console.log('1. IP Address not whitelisted in MongoDB Atlas');
            console.log('2. Network connectivity issues');
        } else if (error.name === 'MongoServerError' && error.code === 8000) {
            console.log('\nPossible issues:');
            console.log('1. Incorrect username or password');
            console.log('2. User doesn\'t have proper permissions');
        }
    }
}

testConnection();
