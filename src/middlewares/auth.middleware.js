import jwt from "jsonwebtoken";
import Usermodel from "../DB/models/user.models.js";
import DoctorModel from "../DB/models/doctor.models.js";

export const rolesTypes = {
  User: "User",
  Admin: "Admin",
  Doctor: "Doctor",
};

// ✅ Authentication Middleware
export const authentication = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new Error("Authorization header is required", { cause: 401 }));
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET); // توكن موحد
    const { id, role } = decoded;

    if (!id || !role) {
      return next(new Error("Invalid token payload", { cause: 400 }));
    }

    let user;
    if (role === "Doctor") {
      user = await DoctorModel.findById(id);
    } else {
      user = await Usermodel.findById(id); // يشمل User و Admin
    }

    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }

    req.user = user;
    req.user.role = role; // مهم جدًا عشان نستخدمه في allowTo
    next();
  } catch (error) {
    return next(new Error("Invalid or expired token", { cause: 401 }));
  }
};

// ✅ Authorization Middleware
export const allowTo = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("You are not allowed", { cause: 403 }));
    }
    next();
  };
};
