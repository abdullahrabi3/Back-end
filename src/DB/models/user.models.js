import mongoose from "mongoose";
import { rolesTypes } from "../../middlewares/auth.middleware.js";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "username is required"],
      minlenght: [3, "username must be at least 3 characters long"],
      maxlenght: [20, "username must be at most 20 characters long"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: [true, "password is required"],
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female"],
        message: "Gender must be 'Male' or'Female'",
      },
      //default: "male",
    },
    age: {
      type: Number,
    },
    role: {
      type: String,
      enum: Object.values(rolesTypes),
      default: rolesTypes.User,
    },

    image: {
      type: String,
    },
    phone: {
      type: String,
    },
    DOB: {
      type: Date,
    },
    isDlete: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);
const Usermodel = mongoose.model("User", userSchema);

export default Usermodel;
