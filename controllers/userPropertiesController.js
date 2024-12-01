import Property from "../models/propertyModel.js";

export const userPropertiesTest = (req, res) => {
    res.json({
        message: "User Properties controller works",
    });
}


export const getUserProperties = async (req, res) => {
    const { id } = req.body;
    try {
        const properties = await Property.find({ ownerId: id });
        res.status(200).json({
            success: true,
            properties
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}