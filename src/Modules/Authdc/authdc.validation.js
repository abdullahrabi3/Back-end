import Joi from "joi";
import mongoose from "mongoose";

// Register Schema
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be less than 20 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),

  gender: Joi.string().valid("male", "female").required().messages({
    "any.only": "Gender must be either male or female",
    "string.empty": "Gender is required",
  }),

  age: Joi.number().min(18).max(100).required().messages({
    "number.base": "Age must be a number",
    "number.min": "Minimum age is 18",
    "number.max": "Maximum age is 100",
  }),

  field: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "string.empty": "Field is required",
      "any.invalid": "Invalid field ID",
    }),
});

// Login Schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
