import mongoose from "mongoose";
import * as dotenv from "dotenv";
import Property from "../models/properties.js";

dotenv.config();

const sampleProperties = [
    {
        title: "Luxury Beach Villa",
        desc: "Beautiful beachfront villa with private pool and stunning ocean views",
        img: "https://res.cloudinary.com/ddb3exc2m/image/upload/v1681196437/samples/landscapes/beach-boat.jpg",
        rating: 4.8,
        price: {
            org: 25000,
            mrp: 30000,
            off: 17
        }
    },
    {
        title: "Mountain Cabin Retreat",
        desc: "Cozy cabin in the mountains with fireplace and hiking trails nearby",
        img: "https://res.cloudinary.com/ddb3exc2m/image/upload/v1681196436/samples/landscapes/nature-mountains.jpg",
        rating: 4.5,
        price: {
            org: 12000,
            mrp: 15000,
            off: 20
        }
    },
    {
        title: "Modern City Apartment",
        desc: "Contemporary apartment in downtown with city views and modern amenities",
        img: "https://res.cloudinary.com/ddb3exc2m/image/upload/v1681196432/samples/food/pot-mussels.jpg",
        rating: 4.2,
        price: {
            org: 8000,
            mrp: 10000,
            off: 20
        }
    },
    {
        title: "Countryside Cottage",
        desc: "Charming cottage with garden, perfect for a peaceful getaway",
        img: "https://res.cloudinary.com/ddb3exc2m/image/upload/v1681196429/samples/landscapes/girl-urban-view.jpg",
        rating: 4.6,
        price: {
            org: 6000,
            mrp: 7500,
            off: 20
        }
    },
    {
        title: "Lakefront Lodge",
        desc: "Spacious lodge by the lake with private dock and water activities",
        img: "https://res.cloudinary.com/ddb3exc2m/image/upload/v1681196429/samples/landscapes/architecture-signs.jpg",
        rating: 4.7,
        price: {
            org: 18000,
            mrp: 22000,
            off: 18
        }
    }
];

const addSampleProperties = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
        
        // Clear existing properties
        await Property.deleteMany({});
        console.log("Cleared existing properties");
        
        // Add new properties
        const result = await Property.insertMany(sampleProperties);
        console.log(`Added ${result.length} sample properties`);
        
        mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
        mongoose.connection.close();
    }
};

addSampleProperties();
