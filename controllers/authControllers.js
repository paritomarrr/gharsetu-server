import unirest from "unirest";
import OTP from "../models/otpModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const sendOTP = async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const fast2smsReq = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
    fast2smsReq.headers({
        "authorization": "xAvC1JaugbjS9zNfPRD2B80EFX5de3YKOWoUmZIqHlry47LM6TqYSQg7Dfs31pTbr0LCmBXO4eAvaHuj"
    });
    fast2smsReq.form({
        "variables_values": otp,
        "route": "otp",
        "numbers": phoneNumber,
    });

    try {
        const fast2smsRes = await fast2smsReq.send();

        if (fast2smsRes.error) {
            console.error(fast2smsRes.error);
            return res.status(500).json({
                message: "Failed to send OTP",
                error: fast2smsRes.error
            });
        }

        await OTP.findOneAndUpdate(
            { phoneNumber },
            { phoneNumber, otp },
            { upsert: true, new: true }
        );

        return res.json({
            success: true,
            message: `OTP sent to ${phoneNumber}`,
            details: fast2smsRes.body
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while sending OTP",
            error: error.message
        });
    }
};

export const verifyOTP = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    // Validate if phone number and OTP are provided
    if (!phoneNumber || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    try {
        // Find the OTP entry associated with the phone number
        const otpEntry = await OTP.findOne({ phoneNumber });

        if (!otpEntry) {
            return res.status(400).json({ message: "Invalid phone number or OTP" });
        }

        // Check if the OTP matches
        if (otpEntry.otp !== otp) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        // Look for an existing user with the provided phone number
        let user = await User.findOne({ phoneNumber });

        if (!user) {
            // If no user is found, create a new user
            user = new User({
                phoneNumber,
                firstName: "",
                lastName: "",
                email: "",
                dob: "",
                password: "",
                image: "",
            });
            await user.save();
        }

        // Generate a JWT token for the user
        const token = jwt.sign({ id: user._id }, 'secret101', {
            expiresIn: "30d",
        });

        // Return success response with the user and token
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            user,
            token,
        });

    } catch (error) {
        console.error(error);
        // Return error response
        return res.status(500).json({
            message: "An error occurred while verifying OTP",
            error: error.message,
        });
    }
};


export const getUser = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Token is required" })
    }

    try {
        const decoded = jwt.verify(token, 'secret101')
        const user = await User.findById(decoded.id)
        return res.json({ success: true, user })
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "An error occurred while verifying token", error: err.message
        })
    }
}