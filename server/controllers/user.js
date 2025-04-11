import User from "../models/user.js"
import Property from "../models/properties.js"
import { createError } from "../error.js"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


dotenv.config();

export const SignUp = async (req, res, next)=> {
    try{
        const {email, password, name} = req.body;

        const existinguser = await User.findOne({email}).exec()
        if(existinguser){
            return next(createError(409, "email is already in use"))
        }



        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        
        const createdUser = await user.save();
        const token = jwt.sign({ id: createdUser._id }, process.env.JWT,{
            expiresIn: "9999 years",
        })
        return res.status(201).json({ token, user });

    }catch(err){
        next(err)
    }

};





export const SignIn = async (req, res, next)=> {
    try{
        const {email, password } = req.body;
        const user = await User.findOne({ email }).exec()

        if(!user){
            return next(createError(409, "User Not found"));
        }

        const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
            
        if(!isPasswordCorrect){
                return next(crceateError(403, "incorrect password"))
        }

        const token = jwt.sign({ id: user._id}, process.env.JWT, { expiresIn: "9999years"});
        return res.status(200).json({ token, user })
    }catch(err){
        next(err)
    }

};





export const BookProperty = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return next(createError(401, "User not authenticated"));
        }

        const { propertyId, startDate, endDate } = req.body;
        if (!propertyId || !startDate || !endDate) {
            return next(createError(400, "Missing required booking information"));
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return next(createError(400, "Invalid date format"));
        }
        if (start >= end) {
            return next(createError(400, "End date must be after start date"));
        }
        if (start < new Date()) {
            return next(createError(400, "Start date cannot be in the past"));
        }

        // Find property and user
        const [property, foundUser] = await Promise.all([
            Property.findById(propertyId),
            User.findById(userId)
        ]);

        if (!property) {
            return next(createError(404, "Property not found"));
        }
        if (!foundUser) {
            return next(createError(404, "User not found"));
        }

        // Create a new booking entry
        const booking = {
            propertyId,
            startDate: start,
            endDate: end
        };

        // Check if property is already booked for these dates
        const existingBooking = foundUser.bookings.find(b => 
            b.propertyId.toString() === propertyId &&
            ((start >= new Date(b.startDate) && start <= new Date(b.endDate)) ||
            (end >= new Date(b.startDate) && end <= new Date(b.endDate)) ||
            (start <= new Date(b.startDate) && end >= new Date(b.endDate)))
        );

        if (existingBooking) {
            return next(createError(400, "Property is already booked for these dates"));
        }

        foundUser.bookings.push(booking);
        await foundUser.save();

        return res.status(200).json({ 
            message: "Property booked successfully",
            booking: {
                ...booking,
                property: {
                    _id: property._id,
                    title: property.title,
                    img: property.img
                }
            }
        });

    } catch (err) {
        console.error('Booking error:', err);
        next(err);
    }
}





export const GetBookedProperty = async (req, res, next) => {
    try {
        console.log('GetBookedProperty called with user:', req.user);
        const userId = req.user.id;
        
        console.log('Finding user with ID:', userId);
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            console.log('User not found with ID:', userId);
            return next(createError(404, "User not found"));
        }
        console.log('Found user:', foundUser);

        console.log('Attempting to populate bookings for user:', userId);
        // Get user's bookings with populated property details
        const userWithBookings = await User.findById(userId)
            .populate({
                path: 'bookings.propertyId',
                model: 'Property',
                select: 'title img rating'
            })
            .exec();
        
        console.log('Populated user bookings:', userWithBookings.bookings);
        return res.status(200).json(userWithBookings.bookings);
    } catch(err) {
        console.error('Error in GetBookedProperty:', err);
        console.error('Error stack:', err.stack);
        next(err);
    }
}





export const AddToFavorites = async (req, res, next) => {
    try {
        const { propertyId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return next(createError(401, "User not authenticated"));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(createError(404, "User not found"));
        }

        const property = await Property.findById(propertyId);
        if (!property) {
            return next(createError(404, "Property not found"));
        }

        if (!user.favourites.includes(propertyId)) {
            user.favourites.push(propertyId);
            await user.save();
        }

        return res
            .status(200)
            .json({ message: "Property added to favorites successfully", user });
    } catch (err) {
        console.error('AddToFavorites - Error:', err.message);
        next(err);
    }
}





export const RemoveFromFavourates = async (req, res, next) => {
    try{
        const { propertyId } = req.body;
        const userJWT = req.user;
        const user = await User.findById(userJWT.id)
        user.favorites = user.favorites.filter((fav) => !fav.equals(propertyId))
        await user.save()

        return res
            .status(200)
            .json({ message: "property removed from favourates sucessfully", user })
    }catch(err){
        next(err)
    }
}





export const GetUserFavorites = async (req, res, next) => {
    try {
        console.log('GetUserFavorites - User ID:', req.user?.id);
        const userId = req.user?.id;
        
        if (!userId) {
            console.error('GetUserFavorites - No user ID found in request');
            return next(createError(401, "User not authenticated"));
        }

        const user = await User.findById(userId)
            .populate({
                path: 'favourites',
                model: 'Property'
            })
            .exec();

        console.log('GetUserFavorites - Found user:', user ? 'yes' : 'no');

        if (!user) {
            return next(createError(404, "User not found"));
        }

        const favorites = user.favourites || [];
        console.log('GetUserFavorites - Number of favorites:', favorites.length);

        return res
            .status(200)
            .json(favorites);
    } catch (err) {
        console.error('GetUserFavorites - Error:', err.message);
        next(err);
    }
}