import properties from "../models/properties.js"


export const AddProperties = async (req, res, next) => {
    try{
       const {title, desc, img, rating, location, price } = req.body;
       const Property = new properties ({
        title,
        desc,
        img,
        rating,
        location,
        price,
       })
       const createdProperty = await Property.save();
       return res   
        .status(201)
        .json({ messgae: "property added successfully",createdProperty })

    }catch(err){
        next(err)
    }
}





export const GetProperties = async (req, res, next) => {
    try{
        let { location, page = 1, limit = 12, sort = 'newest' } = req.query;
        
        // Parse pagination parameters
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        
        // Validate pagination
        if (page < 1) page = 1;
        if (limit < 1) limit = 12;
        if (limit > 50) limit = 50; // Max limit to prevent abuse
        
        const filter = {}

        if(location){
            filter.$or = [
                { "location.city": { $regex: new RegExp(location, "i") } },
                { "location.state": { $regex: new RegExp(location, "i") } },
                { "location.country": { $regex: new RegExp(location, "i") } },
                { "location.address": { $regex: new RegExp(location, "i") } },
            ]
        }

        // Determine sort order
        let sortOption = { createdAt: -1 }; // Default: newest first
        switch(sort) {
            case 'price-low':
                sortOption = { "price.org": 1 };
                break;
            case 'price-high':
                sortOption = { "price.org": -1 };
                break;
            case 'rating':
                sortOption = { rating: -1 };
                break;
            case 'newest':
            default:
                sortOption = { createdAt: -1 };
        }

        // Optimized projection for listing view (minimal fields)
        const listingProjection = {
            title: 1,
            desc: 1,
            img: 1,  // Main image only
            rating: 1,
            location: 1,
            price: 1,
            propertyType: 1,
            maxGuests: 1,
            bedrooms: 1,
            bathrooms: 1,
            createdAt: 1
        };

        // Get total count for pagination
        const totalCount = await properties.countDocuments(filter);
        
        // Calculate skip value
        const skip = (page - 1) * limit;

        const propertyList = await properties
            .find(filter, listingProjection)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean(); // Use lean() for better performance (returns plain JS objects)
        
        return res.status(200).json({
            properties: propertyList,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit,
                hasMore: skip + propertyList.length < totalCount
            }
        });
    }catch(err){
        next(err)
    }
}





export const GetPropertyDetails = async (req, res, next) => {
    try{
        const { id } = req.params
        const property = await properties.findById(id);
        return res.status(200).json(property)
    }catch(err){
        next(err)
    }
}