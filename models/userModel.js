import mongoose, { models } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image:{
      type: String,
      required: false,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: 'newUser',
    },
    phoneNumber:{
      type: String,
      required: false,
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

const User = models.users || mongoose.model('users', userSchema)
export default User