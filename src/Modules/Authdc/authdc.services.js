import DoctorModel from "../../DB/models/doctor.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerdc = async (req, res, next) => {
  const { name, email, password, gender, age, field } = req.body;

  const existing = await DoctorModel.findOne({ email });
  if (existing)
    return res
      .status(409)
      .json({ key: false, code: 409, message: "Email already exists" });

  const hashedPassword = bcrypt.hashSync(password, 10);

  const doctor = await DoctorModel.create({
    name,
    email,
    password: hashedPassword,
    gender,
    age,
    field,
  });

  const token = jwt.sign(
    { id: user._id, role: "Doctor" }, // أو Doctor أو Admin حسب الحالة
    process.env.TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(201).json({
    key: true,
    code: 201,
    message: "Doctor registered successfully",
    data: { token, doctor },
  });
};

export const logindc = async (req, res, next) => {
  const { email, password } = req.body;

  const doctor = await DoctorModel.findOne({ email });
  if (!doctor)
    return res
      .status(404)
      .json({ key: false, code: 404, message: "Doctor not found" });

  if (!doctor.confirmEmail)
    return res
      .status(400)
      .json({ key: false, code: 400, message: "Email not confirmed" });

  const isMatch = bcrypt.compareSync(password, doctor.password);
  if (!isMatch)
    return res
      .status(400)
      .json({ key: false, code: 400, message: "Incorrect password" });

  const token = jwt.sign(
    { id: doctor._id, isloggedIn: true, role: "Doctor" }, // أضفنا role
    process.env.TOKEN_SECRET, // استخدمنا التوكن الموحد
    { expiresIn: "7d" }
  );

  if (doctor.isDeleted) {
    doctor.isDeleted = false;
    await doctor.save();
  }

  return res.status(200).json({
    key: true,
    code: 200,
    message: "Login successful",
    data: {
      token,
      doctor: {
        name: doctor.name,
        email: doctor.email,
        gender: doctor.gender,
        age: doctor.age,
        field: doctor.field,
      },
    },
  });
};
