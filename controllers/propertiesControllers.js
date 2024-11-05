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
            images 
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
            images
        });

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
