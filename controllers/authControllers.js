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
            success:true,
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

    if (!phoneNumber || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    try {
        // Find the OTP entry in the database
        const otpEntry = await OTP.findOne({ phoneNumber });

        if (!otpEntry) {
            return res.status(400).json({ message: "Invalid phone number or OTP" });
        }

        // Check if the OTP matches
        if (otpEntry.otp === otp) {
            const newUser = new User({ phoneNumber });
            await newUser.save();

            const token  = jwt.sign({ id: newUser._id }, 'secret101', {
                expiresIn: "30d",
            });

            return res.json({ success: true,  message: "OTP verified successfully", user: newUser, token });
        } else {
            return res.status(400).json({ message: "Incorrect OTP" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while verifying OTP",
            error: error.message
        });
    }
};