import User from '../models/userModel.js'

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
