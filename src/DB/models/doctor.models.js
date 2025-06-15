import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field", // لازم يكون عندك موديل اسمه Field
      required: true,
    },

    phone: {
      type: String,
    },

    bio: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    confirmEmail: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["Doctor", "Admin"],
      default: "Doctor",
    },
  },
  {
    timestamps: true,
  }
);

const DoctorModel = mongoose.model("Doctor", doctorSchema);

export default DoctorModel;
