import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://bhuvakrish03:KrishBhuva2003@airbnb.l4jso6f.mongodb.net/?appName=airbnb';

console.log('Testing exact connection string from Atlas...\n');

const client = new MongoClient(uri);

try {
  await client.connect();
  console.log('✅ SUCCESS! MongoDB connection established!\n');
  
  const dbList = await client.db().admin().listDatabases();
  console.log('Available databases:');
  dbList.databases.forEach(db => {
    console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
  });
  
  await client.close();
  console.log('\n🎉 Connection verified! Ready to update .env file.');
  process.exit(0);
} catch (err) {
  console.log('❌ Connection failed:', err.message);
  console.log('\nFull error:', err);
  process.exit(1);
}
