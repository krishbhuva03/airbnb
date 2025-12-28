import express from "express";
import { createReview, getPropertyReviews, deleteReview } from "../controllers/reviews.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Create a review (requires auth)
router.post("/create", verifyToken, createReview);

// Get all reviews for a property (public)
router.get("/property/:propertyId", getPropertyReviews);

// Delete a review (requires auth)
router.delete("/:id", verifyToken, deleteReview);

export default router;
