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
        message: "Gender must be 'Male' or 'Female'",
      },
    },
    age: {
      type: Number,
      min: [0, "Doctor must be at least 0 years old"],
      max: [80, "Doctor must be at most 80 years old"],
    },
    field: {
      type: Number,
      ref: "Field",
    },
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    phone: {
      type: String,
    },
    bio: {
      type: String,
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
      min: 0,
      max: 5,
    },
    patients: {
      type: Number,
      default: 0,
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
      default: "doctor",
    },
  },
  { timestamps: true }
);

const DoctorModel = mongoose.model("Doctor", doctorSchema);

export default DoctorModel;
