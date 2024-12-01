import User from '../models/userModel.js';
import Property from '../models/propertyModel.js';

export const getSellerProfile = async (req, res) => {
    const { sellerId } = req.body;

    console.log('sellerId', sellerId);

    try {
        const seller = await User.findOne(
            { _id: sellerId },
            { password: 0 } // Exclude the password field
        );


        const properties = await Property.find({
            ownerId: sellerId,
        });

        return res.status(200).json({ success: true, sellerId, seller ,properties });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const getSellerName = async (req, res) => {
    const { sellerId } = req.body;
    try {
        if (!sellerId) {
            return res.status(400).json({ success: false, error: "Seller ID is required." });
        }

        // Query the seller while excluding the password field
        const seller = await User.findOne(
            { _id: sellerId },
            { password: 0 } // Exclude the password field
        );

        if (!seller) {
            return res.status(404).json({ success: false, error: "Seller not found." });
        }

        // Return only the desired fields explicitly
        const sellerDetails = {
            firstName: seller.firstName,
            lastName: seller.lastName,
            email: seller.email,
        };

        console.log("sellerDetails", sellerDetails);

        return res.status(200).json({ success: true, seller: sellerDetails });

    } catch (error) {
        console.error("Error fetching seller:", error);
        return res.status(500).json({ success: false, error: error.message, sellerId });
    }
};
