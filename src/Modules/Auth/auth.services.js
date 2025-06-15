import Usermodel from "../../DB/models/user.models.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { rolesTypes } from "../../middlewares/auth.middleware.js";

export const register = async (req, res, next) => {
  const { name, email, password, gender, age } = req.body;

  const checkUser = await Usermodel.findOne({ email });
  if (checkUser) {
    return res
      .status(409)
      .json({ key: false, code: 409, message: "user found" });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await Usermodel.create({
    name,
    email,
    password: hashedPassword,
    gender,
    age,
  });
  const token = jwt.sign(
    { id: user._id },
    process.env.TOKEN_SECRIT_USER, // تأكد إنها متعرفة في .env
    { expiresIn: "7d" }
  );
  return res.status(201).json({
    key: true,
    code: 201,
    message: "User created successfully",
    data: { token: token, user: user },
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Usermodel.findOne({ email });
  if (!user) return next(new Error("user not found", { cause: 404 }));

  if (!user.confirmEmail === false)
    return next(new Error("user not confirmed", { cause: 400 }));

  const match = bcrypt.compareSync(req.body.password, user.password);
  if (!match) return next(new Error("invalid password", { cause: 400 }));
  const token = jwt.sign(
    { id: user._id, isloggedIn: true },
    user.role === rolesTypes.User
      ? process.env.TOKEN_SECRIT_USER
      : process.env.TOKEN_SECRIT_ADMIN,
    { expiresIn: 60 * 60 }
  );

  if (user.isDlete == true) {
    user.isDlete = false;
    await user.save();
  }

  return res.status(200).json({
    key: true,
    code: 200,
    message: "login successfully",
    data: {
      token: token,
      user: user,
    },
  });
};
