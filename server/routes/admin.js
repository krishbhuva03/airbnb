import express from "express";
import { verifyToken, verifyAdmin } from "../middlewares/verifyToken.js";
import User from "../models/user.js";
import Property from "../models/properties.js";
import Review from "../models/Review.js";

const router = express.Router();

// Get admin dashboard stats
router.get("/stats", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProperties = await Property.countDocuments();
        const totalReviews = await Review.countDocuments();
        
        // Get total bookings
        const usersWithBookings = await User.find({ "bookings.0": { $exists: true } });
        const totalBookings = usersWithBookings.reduce((sum, user) => sum + user.bookings.length, 0);
        
        // Get recent users (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentUsers = await User.countDocuments({ createdAt: { $gte: weekAgo } });
        
        // Get property ratings distribution
        const properties = await Property.find();
        const avgRating = properties.length > 0 
            ? (properties.reduce((sum, p) => sum + (p.rating || 0), 0) / properties.length).toFixed(1)
            : 0;
        
        res.status(200).json({
            totalUsers,
            totalProperties,
            totalBookings,
            totalReviews,
            recentUsers,
            avgRating: parseFloat(avgRating),
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Error fetching admin stats", error: error.message });
    }
});

// Get all users (admin only)
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 })
            .limit(100);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// Create a new property (admin only)
router.post("/property", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { title, desc, img, price, rating } = req.body;
        
        const newProperty = new Property({
            title,
            desc,
            img,
            price,
            rating: rating || 3.5,
        });
        
        const savedProperty = await newProperty.save();
        res.status(201).json(savedProperty);
    } catch (error) {
        console.error("Error creating property:", error);
        res.status(500).json({ message: "Error creating property", error: error.message });
    }
});

// Update a property (admin only)
router.put("/property/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );
        
        if (!updatedProperty) {
            return res.status(404).json({ message: "Property not found" });
        }
        
        res.status(200).json(updatedProperty);
    } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ message: "Error updating property", error: error.message });
    }
});

// Delete a property (admin only)
router.delete("/property/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedProperty = await Property.findByIdAndDelete(id);
        if (!deletedProperty) {
            return res.status(404).json({ message: "Property not found" });
        }
        
        // Also delete associated reviews
        await Review.deleteMany({ propertyId: id });
        
        res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        console.error("Error deleting property:", error);
        res.status(500).json({ message: "Error deleting property", error: error.message });
    }
});

export default router;
