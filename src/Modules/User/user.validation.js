import Joi from "joi";

export const editprofileSchema = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    "string.base": "الاسم يجب أن يكون نصًا",
    "string.min": "الاسم قصير جدًا",
    "string.max": "الاسم طويل جدًا",
  }),

  email: Joi.string().email().messages({
    "string.email": "يرجى إدخال بريد إلكتروني صالح",
  }),

  password: Joi.string().min(6).messages({
    "string.min": "كلمة المرور الحالية يجب أن تكون على الأقل 6 حروف",
  }),

  newPassword: Joi.string().min(6).messages({
    "string.min": "كلمة المرور الجديدة يجب أن تكون على الأقل 6 حروف",
  }),
}).custom((value, helpers) => {
  if (value.newPassword && !value.password) {
    return helpers.message(
      "يجب إدخال كلمة المرور الحالية عند تغيير كلمة المرور"
    );
  }
  return value;
});
