import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName:{
      type: String,
      default: ""
    },
    lastName:{
      type: String,
      default: ""
    },
    email: {
      type: String,
      default: ""
    },
    dob:{
      type: String,
      default: ""
    },
    image:{
      type: String,
      default: ""
    },
    password: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      default: 'user',
    },
    phoneNumber:{
      type: String,
      required: true,
    },
    savedProperties: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Property',
      default: [],
    },
    isAdmin:{
      type: Boolean,
      default: false,
    },
    isNewUser:{
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const User = mongoose.models.NewUserr || mongoose.model('NewUserr', userSchema)
export default User