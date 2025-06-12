import Joi from "joi";

export const editprofileSchema = Joi.object({
  userName: Joi.string().min(3).max(20),
  email: Joi.string().email(),
}).required();

export const changepassword = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().not(Joi.ref("oldPassword")).required(),
  confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
}).required();
