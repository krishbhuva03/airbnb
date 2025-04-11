import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import User from './models/user.js';
import Property from './models/properties.js';

dotenv.config();

const testMongoDB = async () => {
    try {
        // Test MongoDB Connection
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('✅ MongoDB Atlas Connection Successful');

        // Test User Creation
        const testUser = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword123'
        });
        await testUser.save();
        console.log('✅ User Creation Successful');

        // Test Property Creation
        const testProperty = new Property({
            title: 'Test Property',
            desc: 'A beautiful test property',
            img: 'https://example.com/test.jpg',
            price: {
                org: 100,
                mrp: 120,
                off: 20
            },
            rating: 4.5
        });
        await testProperty.save();
        console.log('✅ Property Creation Successful');

        // Test Property Retrieval
        const properties = await Property.find();
        console.log('✅ Property Retrieval Successful');
        console.log(`Found ${properties.length} properties`);

        // Test User Favorites
        await User.findOneAndUpdate(
            { email: 'test@example.com' },
            { $push: { favourites: testProperty._id } }
        );
        console.log('✅ Adding to Favorites Successful');

        // Cleanup Test Data
        await User.deleteOne({ email: 'test@example.com' });
        await Property.deleteOne({ title: 'Test Property' });
        console.log('✅ Test Data Cleanup Successful');

        console.log('\n🎉 All tests completed successfully!');
    } catch (error) {
        console.error('❌ Test Failed:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
};

testMongoDB();
