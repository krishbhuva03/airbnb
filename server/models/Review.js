import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

// Ensure a user can only review a property once
ReviewSchema.index({ propertyId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Review", ReviewSchema);
