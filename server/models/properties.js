import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        default: null,
    },
    // Multiple images for gallery
    images: [{
        type: String,
    }],
    rating: {
        type: Number,
        default: 3.5,
    },
    price: {
        org: {
            type: Number,
            required: true
        },
        mrp: {
            type: Number,
            required: true
        },
        off: {
            type: Number,
            required: false,
            default: 0
        }
    },
    // Amenities list
    amenities: [{
        icon: {
            type: String,
            default: "check"
        },
        name: {
            type: String,
            required: true
        }
    }],
    // Host information
    host: {
        name: {
            type: String,
            default: "Host"
        },
        image: {
            type: String,
            default: null
        },
        joinedDate: {
            type: Date,
            default: Date.now
        },
        isSuperhost: {
            type: Boolean,
            default: false
        }
    },
    // Location details
    location: {
        address: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
        country: {
            type: String,
            default: ""
        },
        coordinates: {
            lat: {
                type: Number,
                default: 0
            },
            lng: {
                type: Number,
                default: 0
            }
        }
    },
    // House rules
    houseRules: [{
        type: String
    }],
    // Check-in/out times
    checkInTime: {
        type: String,
        default: "3:00 PM"
    },
    checkOutTime: {
        type: String,
        default: "11:00 AM"
    },
    // Property specifications
    maxGuests: {
        type: Number,
        default: 2
    },
    bedrooms: {
        type: Number,
        default: 1
    },
    bathrooms: {
        type: Number,
        default: 1
    },
    propertyType: {
        type: String,
        default: "Entire home"
    }
}, { timestamps: true });

export default mongoose.model("Property", propertySchema);
