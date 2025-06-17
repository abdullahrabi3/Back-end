import Joi from "joi";

export const registerAuthSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid("male", "female").required(),
  age: Joi.number().min(1).max(100).required(),
});

export const loginAuthSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
