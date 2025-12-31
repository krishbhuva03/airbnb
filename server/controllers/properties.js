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
        let { location } = req.query;
        const filter = {}

        if(location){
            filter.$or = [
                { "location.city": { $regex: new RegExp(location, "i") } },
                { "location.state": { $regex: new RegExp(location, "i") } },
                { "location.country": { $regex: new RegExp(location, "i") } },
                { "location.address": { $regex: new RegExp(location, "i") } },
            ]
        }

        const propertyList = await properties.find(filter, {
            title: 1,
            desc: 1,
            img: 1,
            images: 1,
            rating: 1,
            location: 1,
            price: 1,
            amenities: 1,
            host: 1,
            houseRules: 1,
            checkInTime: 1,
            checkOutTime: 1,
            maxGuests: 1,
            bedrooms: 1,
            bathrooms: 1,
            propertyType: 1
        })
        return res.status(200).json(propertyList)
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