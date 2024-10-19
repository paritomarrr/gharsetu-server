import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    image:{
      type: String,
    },
    password: {
      type: String,
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
    }
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model('users2', userSchema)
export default User