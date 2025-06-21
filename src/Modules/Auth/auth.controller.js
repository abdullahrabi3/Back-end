import { Router } from "express";
import * as authServices from "./auth.services.js";
import { registerAuthSchema, loginAuthSchema } from "./auth.validation.js";
import { validation } from "../../middlewares/validation.middlware.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

const router = Router();

router.post(
  "/register",
  validation(registerAuthSchema),
  asyncHandler(authServices.register)
);
router.post(
  "/login",
  validation(loginAuthSchema),
  asyncHandler(authServices.login)
);

export default router;
