import User from '../models/userModel.js'
import Property from '../models/propertyModel.js';

export const userTest = (req, res) => {
    res.json({
        message: 'User controller works'
    })
}

export const saveUserDetails = async (req, res) => {
    const { id, firstName, lastName, email, dob, password, phoneNumber } = req.body;

    if (!id) {
        return res.json({
            success: false,
            msg: "ID not present"
        });
    }

    try {
        // Use findById to get the single user by ID
        const currUser = await User.findById(id);

        if (!currUser) {
            return res.json({
                success: false,
                msg: "User not found"
            });
        }

        // Update the user's fields
        currUser.firstName = firstName;
        currUser.lastName = lastName;
        currUser.email = email;
        currUser.dob = dob;
        currUser.password = password; // Hash the password before saving in production
        currUser.phoneNumber = phoneNumber;
        currUser.isNewUser = false;

        // Save the updated user
        await currUser.save();

        res.json({
            success: true,
            currUser,
            msg: "User updated"
        });
    } catch (error) {
        res.json({
            success: false,
            msg: "Error updating user",
            error: error.message
        });
    }
};

export const bookmarkProperty = async (req, res) => {
    const {userId, propertyId} = req.body;

    if(!userId || !propertyId) {
        return res.json({
            success: false,
            msg: "User ID or Property ID not present"
        });
    }

    try {
        const currUser = await User.findById(userId);

        if (!currUser) {
            return res.json({
                success: false,
                msg: "User not found"
            });
        }

        if (currUser.savedProperties.includes(propertyId)) {
            return res.json({
                success: true,
                msg: "Property already bookmarked"
            });
        }

        currUser.savedProperties.push(propertyId);

        await currUser.save();

        res.json({
            success: true,
            currUser,
            msg: "Property bookmarked"
        });
    } catch (error) {
        res.json({
            success: false,
            msg: "Error bookmarking property",
            error: error.message
        });
    }
}

export const getBookmarkedProperties = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.json({
            success: false,
            msg: "User ID not present"
        });
    }

    try {
        const currUser = await User.findById(userId);

        if (!currUser) {
            return res.json({
                success: false,
                msg: "User not found"
            });
        }

        // Fetch properties based on the savedProperty IDs
        const bookmarkedProperties = await Property.find({
            '_id': { $in: currUser.savedProperties }
        });

        res.json({
            success: true,
            bookmarks: bookmarkedProperties,
            msg: "Bookmarked properties retrieved"
        });
    } catch (error) {
        res.json({
            success: false,
            msg: "Error retrieving bookmarked properties",
            error: error.message
        });
    }
}


export const unbookmarkProperty = async (req, res) => {
    const {userId, propertyId} = req.body;

    if(!userId || !propertyId) {
        return res.json({
            success: false,
            msg: "User ID or Property ID not present"
        });
    }

    try {
        const currUser = await User.findById(userId);

        if (!currUser) {
            return res.json({
                success: false,
                msg: "User not found"
            });
        }

        if (!currUser.bookmarks.includes(propertyId)) {
            return res.json({
                success: false,
                msg: "Property not bookmarked"
            });
        }

        currUser.savedProperties = currUser.savedProperties.filter(id => id !== propertyId);

        await currUser.save();

        res.json({
            success: true,
            currUser,
            msg: "Property unbookmarked"
        });
    } catch (error) {
        res.json({
            success: false,
            msg: "Error unbookmarking property",
            error: error.message
        });
    }
}