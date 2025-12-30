import Review from "../models/Review.js";
import Property from "../models/properties.js";
import mongoose from "mongoose";

// Create a new review
export const createReview = async (req, res) => {
    try {
        const { propertyId, rating, comment, userName } = req.body;
        const userId = req.user.id;

        // Convert string IDs to ObjectId
        const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Check if user already reviewed this property
        const existingReview = await Review.findOne({ 
            propertyId: propertyObjectId, 
            userId: userObjectId 
        });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this property" });
        }

        const newReview = new Review({
            propertyId: propertyObjectId,
            userId: userObjectId,
            userName,
            rating,
            comment,
        });

        const savedReview = await newReview.save();

        // Update property average rating
        const reviews = await Review.find({ propertyId: propertyObjectId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Property.findByIdAndUpdate(propertyId, { rating: avgRating.toFixed(1) });

        res.status(201).json(savedReview);
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Error creating review", error: error.message });
    }
};

// Get all reviews for a property
export const getPropertyReviews = async (req, res) => {
    try {
        const { propertyId } = req.params;
        
        // Convert to ObjectId for proper matching
        const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
        
        const reviews = await Review.find({ propertyId: propertyObjectId })
            .sort({ createdAt: -1 })
            .limit(50);
        
        // Calculate average rating
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        res.status(200).json({
            reviews,
            avgRating: parseFloat(avgRating),
            totalReviews: reviews.length
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
};

// Delete a review (only by the owner)
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.userId.toString() !== userId && !req.user.isAdmin) {
            return res.status(403).json({ message: "You can only delete your own reviews" });
        }

        const propertyId = review.propertyId;
        await Review.findByIdAndDelete(id);

        // Update property average rating
        const reviews = await Review.find({ propertyId });
        const avgRating = reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
            : 3.5;
        await Property.findByIdAndUpdate(propertyId, { rating: avgRating.toFixed(1) });

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Error deleting review", error: error.message });
    }
};
