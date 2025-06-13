import Joi from "joi";

export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.params, ...req.body, ...req.query };

    const result = schema.validate(data, { abortEarly: false });
    if (result.error) {
      const errorMessages = result.error.details.map((obj) => obj.message);
      return next(new Error(errorMessages, { cause: 400 }));
    }

    return next();
  };
};

export const generalFields = {
  userName: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  password: Joi.string(),
};
