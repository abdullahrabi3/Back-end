import mongoose from "mongoose";
const { Schema } = mongoose;

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  // ... أي حقول أخرى
});
mongoose.model("Field", fieldSchema);

const FieldModel = mongoose.model("Field");
export default FieldModel;
