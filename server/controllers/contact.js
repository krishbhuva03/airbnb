import Contact from "../models/contact.js";
import { createError } from "../error.js";

export const submitContact = async (req, res, next) => {
    try {
        console.log('Received contact submission:', req.body);
        const { name, email, subject, message } = req.body;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Invalid email format:', email);
            return next(createError(400, "Invalid email format"));
        }

        // Create new contact submission
        const newContact = new Contact({
            name,
            email,
            subject,
            message
        });

        console.log('Attempting to save contact:', newContact);
        // Save to database
        const savedContact = await newContact.save();
        console.log('Successfully saved contact:', savedContact);

        res.status(201).json({
            success: true,
            message: "Message sent successfully!",
            data: savedContact
        });
    } catch (error) {
        console.error('Error in submitContact:', error);
        next(createError(500, "Failed to send message"));
    }
};

export const getContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: contacts
        });
    } catch (error) {
        console.error('Error in getContacts:', error);
        next(createError(500, "Failed to fetch contact messages"));
    }
};
