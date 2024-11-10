import Property from '../models/propertyModel.js';

export const propertiesTest = (req, res) => {
    res.json({
        message: 'Properties controller works'
    })
}

export const createProperty = async (req, res) => {
    try {
        const {
            ownerId,
            listedBy,
            firstName,
            lastName,
            phoneNumber,
            email,
            propertyType,
            firmName,
            propertySubType,
            availableFor,
            project,
            area,
            address,
            plotSize,
            furnishType,
            flatFurnishings,
            societyAmenities,
            askedPrice,
            propertyStatus,
            coordinates,
            images,
            description
        } = req.body;

        console.log('oD', ownerId)

        const newProperty = new Property({
            ownerId,
            listedBy,
            firstName,
            lastName,
            phoneNumber,
            email,
            propertyType,
            firmName,
            propertySubType,
            availableFor,
            project,
            area,
            address,
            plotSize,
            furnishType,
            flatFurnishings,
            societyAmenities,
            askedPrice,
            propertyStatus,
            coordinates,
            images,
            description
        });

        console.log('description', description)

        const savedProperty = await newProperty.save();

        // Respond with the created property
        return res.status(201).json({
            success: true,
            message: "Property created successfully",
        });
    } catch (error) {
        console.error("Error creating property:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create property",
            error: error.message
        });
    }
};

export const getAllProperties = async (req, res) => {
    const {mode} = req.body;
    
    const properties = await Property.find({availableFor: mode === 'rent' ? 'Rent' : 'Sell'});

    return res.json({
        message: 'Get all properties',
        success: true,
        properties
    })
}

export const getSingleProperty = async (req, res) => {
    const {propertyId} = req.body;

    const property = await Property.findById(propertyId);

    return res.json({
        success: true,
        property
    })
}

export const getRecentProperties = async (req, res) => {
    const properties = await Property.find().sort({createdAt: -1}).limit(5);

    return res.json({
        success: true,
        properties
    })
}