import jwt from "jsonwebtoken";
import Usermodel from "../DB/models/user.models.js";

export const rolesTypes = {
  User: "User",
  Admin: "Admin",
};

//authmiddleware
export const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return next(new Error("authorization header is rquire", { cause: 401 }));
    }
    const [Bearer, token] = authorization.split(" ");
    let TOKEN_SIGNATURE = undefined;
    switch (Bearer) {
      case "Bearer":
        TOKEN_SIGNATURE = process.env.TOKEN_SECRIT_USER;
        break;
      case "Admin":
        TOKEN_SIGNATURE = process.env.TOKEN_SECRIT_ADMIN;
        break;
      default:
        break;
    }

    const { id } = jwt.verify(token, TOKEN_SIGNATURE);
    const user = await Usermodel.findById(id);
    if (!user) {
      return next(new Error("user not found", { cause: 404 }));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

//Authorization
export const allowTo = (role = []) => {
  return async (req, res, next) => {
    try {
      if (!role.includes(req.user.role))
        return next(new Error("you are not allowed", { cause: 403 }));
      next();
    } catch (error) {
      return next(error);
    }
  };
};
export default { allowTo, authentication };
