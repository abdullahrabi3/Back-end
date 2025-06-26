import Usermodel from "../../DB/models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { rolesTypes } from "../../middlewares/auth.middleware.js";

// Register Function
export const register = async (req, res, next) => {
  const { name, email, password, gender, age } = req.body;

  // Check if user already exists
  const checkUser = await Usermodel.findOne({ email });
  if (checkUser) {
    return res
      .status(409)
      .json({ key: false, code: 409, message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create the user
  const user = await Usermodel.create({
    name,
    email,
    password: hashedPassword,
    gender,
    age,
  });

  // Generate token
  const token = jwt.sign(
    { id: user._id, role: "User" }, // أو Doctor أو Admin حسب الحالة
    process.env.TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(201).json({
    key: true,
    code: 201,
    message: "User created successfully",
    data: { token, user },
  });
};

// Login Function
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await Usermodel.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ key: false, code: 404, message: "User not found" });
  }

  // Check if email is confirmed
  if (!user.confirmEmail) {
    return res
      .status(400)
      .json({ key: false, code: 400, message: "Email not confirmed" });
  }

  // Compare password
  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return res
      .status(400)
      .json({ key: false, code: 400, message: "Invalid password" });
  }

  // Handle soft deletion reversal
  if (user.isDeleted) {
    user.isDeleted = false;
    await user.save();
  }

  // Generate token based on role
  const token = jwt.sign(
    { id: user._id, role: "User" }, // أو Doctor أو Admin حسب الحالة
    process.env.TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    key: true,
    code: 200,
    message: "Login successful",
    data: {
      token,
      user,
    },
  });
};
