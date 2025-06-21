import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ecg: Number,
    weight: Number,
    muscle: Number,
    fat: Number,
    bloodSugar: Number,
  },
  { timestamps: true }
);

const MeasurementModel = mongoose.model("Measurement", measurementSchema);

export default MeasurementModel;
