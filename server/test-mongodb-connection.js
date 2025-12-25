import { MongoClient } from 'mongodb';

const testConnections = async () => {
  // Test 1: Original connection string
  const uri1 = "mongodb+srv://bhuvakrish03:Kr%21shBhuva2003@airbnb.l4jso6f.mongodb.net/?retryWrites=true&w=majority&appName=airbnb";
  
  // Test 2: Try without special encoding
  const uri2 = "mongodb+srv://bhuvakrish03:KrishBhuva2003@airbnb.l4jso6f.mongodb.net/?retryWrites=true&w=majority&appName=airbnb";
  
  console.log('Testing MongoDB connections...\n');
  
  // Test original
  console.log('Test 1: With %21 encoding (!)');
  try {
    const client1 = new MongoClient(uri1);
    await client1.connect();
    console.log('✅ Test 1 SUCCESS - Connected with %21 encoding');
    await client1.close();
    process.exit(0);
  } catch (err) {
    console.log('❌ Test 1 FAILED:', err.message);
  }
  
  // Test without special char
  console.log('\nTest 2: Without special character');
  try {
    const client2 = new MongoClient(uri2);
    await client2.connect();
    console.log('✅ Test 2 SUCCESS - Connected without special character');
    await client2.close();
    process.exit(0);
  } catch (err) {
    console.log('❌ Test 2 FAILED:', err.message);
  }
  
  console.log('\n⚠️  All tests failed. Password may need to be updated in MongoDB Atlas.');
  process.exit(1);
};

testConnections();
