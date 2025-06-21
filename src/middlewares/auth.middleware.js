import jwt from "jsonwebtoken";
import Usermodel from "../DB/models/user.models.js";
import DoctorModel from "../DB/models/doctor.models.js"; // تأكد من المسار الصحيح

export const rolesTypes = {
  User: "User",
  Admin: "Admin",
  doctor: "doctor",
};

// ✅ Authentication Middleware
export const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return next(
        new Error("authorization header is required", { cause: 401 })
      );
    }

    const [Bearer, token] = authorization.split(" ");

    let TOKEN_SIGNATURE;
    let user = null;

    switch (Bearer) {
      case "Bearer":
        TOKEN_SIGNATURE = process.env.TOKEN_SECRIT_USER;
        user = await getUserFromToken(token, TOKEN_SIGNATURE, Usermodel);
        break;
      case "Admin":
        TOKEN_SIGNATURE = process.env.TOKEN_SECRIT_ADMIN;
        user = await getUserFromToken(token, TOKEN_SIGNATURE, Usermodel);
        break;
      case "Doctor":
        TOKEN_SIGNATURE = process.env.TOKEN_SECRIT_DOCTOR;
        user = await getUserFromToken(token, TOKEN_SIGNATURE, DoctorModel);
        break;
      default:
        return next(new Error("Invalid token type", { cause: 400 }));
    }

    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

// ✅ Authorization Middleware
export const allowTo = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return next(new Error("You are not allowed", { cause: 403 }));
      }
      next();
    } catch (error) {
      return next(error);
    }
  };
};

// ✅ Helper to decode and find user
const getUserFromToken = async (token, secret, model) => {
  const decoded = jwt.verify(token, secret);
  return await model.findById(decoded.id);
};

export default { authentication, allowTo };
