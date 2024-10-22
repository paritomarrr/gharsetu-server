import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    reqID :{
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const OTP = mongoose.models.OTP || mongoose.model("OTP", otpSchema);
export default OTP;