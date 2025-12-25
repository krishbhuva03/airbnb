import { MongoClient } from 'mongodb';

const testPasswords = async () => {
  const passwords = [
    { name: 'Password 1: Kr!shBhuva2003', encoded: 'Kr%21shBhuva2003' },
    { name: 'Password 2: 196170303023', encoded: '196170303023' }
  ];
  
  console.log('Testing MongoDB passwords...\n');
  
  for (const pwd of passwords) {
    const uri = `mongodb+srv://bhuvakrish03:${pwd.encoded}@airbnb.l4jso6f.mongodb.net/?retryWrites=true&w=majority&appName=airbnb`;
    
    console.log(`Testing: ${pwd.name}`);
    try {
      const client = new MongoClient(uri);
      await client.connect();
      console.log(`✅ SUCCESS! Connected with: ${pwd.name}\n`);
      
      // List databases to confirm
      const dbList = await client.db().admin().listDatabases();
      console.log('Available databases:', dbList.databases.map(db => db.name).join(', '));
      
      await client.close();
      console.log(`\n🎉 Working password: ${pwd.encoded}`);
      process.exit(0);
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}\n`);
    }
  }
  
  console.log('⚠️  Both passwords failed.');
  process.exit(1);
};

testPasswords();
