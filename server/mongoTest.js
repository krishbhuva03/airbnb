const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://bhuvakrish03:Kr%21shBhuva2003@airbnb.l4jso6f.mongodb.net/?retryWrites=true&w=majority&appName=airbnb";
const client = new MongoClient(uri);

async function run() {
    try {
        console.log('Attempting to connect...');
        await client.connect();
        console.log('Connected successfully to MongoDB Atlas');
        
        // List databases
        const dbList = await client.db().admin().listDatabases();
        console.log('Databases:', dbList.databases.map(db => db.name));
    } catch (err) {
        console.error('Connection error details:');
        console.error('Name:', err.name);
        console.error('Message:', err.message);
        console.error('Code:', err.code);
        if (err.result) console.error('Result:', err.result);
        
        // Check for specific error conditions
        if (err.message.includes('bad auth')) {
            console.log('\nAuthentication failed. Please check:');
            console.log('1. Username is correct (currently using: bhuvakrish03)');
            console.log('2. Password is correct');
            console.log('3. User has the correct permissions in MongoDB Atlas');
        }
        if (err.message.includes('connection timed out')) {
            console.log('\nConnection timed out. Please check:');
            console.log('1. Your IP address is whitelisted in MongoDB Atlas');
            console.log('2. Your network connection is stable');
            console.log('3. The cluster name is correct (currently using: airbnb)');
        }
    } finally {
        await client.close();
        console.log('Connection closed');
    }
}

run().catch(console.dir);
