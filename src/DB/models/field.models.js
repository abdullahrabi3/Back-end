import mongoose from "mongoose";
const { Schema } = mongoose;

const fieldSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Field name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const FieldModel = mongoose.model("Field", fieldSchema);

export default FieldModel; 