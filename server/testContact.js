import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Contact from './models/contact.js';

dotenv.config();

const testContact = async () => {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB Atlas');

        // Create a test contact
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'This is a test message'
        };

        console.log('Creating test contact...');
        const contact = new Contact(testData);
        const savedContact = await contact.save();
        console.log('Test contact created successfully:', savedContact);

        // Verify the contact was saved
        console.log('\nFetching all contacts...');
        const contacts = await Contact.find();
        console.log('Total contacts in database:', contacts.length);
        console.log('All contacts:', contacts);

        // Clean up test data
        console.log('\nCleaning up test data...');
        await Contact.deleteOne({ _id: savedContact._id });
        console.log('Test data cleaned up');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
};

testContact();
