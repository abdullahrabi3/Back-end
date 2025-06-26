import mongoose from "mongoose";

const { Schema } = mongoose;

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: "Gender must be 'male' or 'female'",
      },
      required: [true, "Gender is required"],
    },
    age: {
      type: Number,
      min: [0, "Doctor must be at least 0 years old"],
      max: [80, "Doctor must be at most 80 years old"],
      required: [true, "Age is required"],
    },
    field: {
      type: Number,
      required: true,
    },

    // patients as array with default empty
    patients: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    phone: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    certificates: [
      {
        type: String,
      },
    ],
    services: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["doctor"],
      default: "doctor",
    },
  },
  { timestamps: true }
);

const DoctorModel = mongoose.model("Doctor", doctorSchema);
export default DoctorModel;
