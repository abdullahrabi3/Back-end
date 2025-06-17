import { Router } from "express";
import * as authdcServices from "./authdc.services.js";
import * as authdcValidation from "./authdc.validation.js";
import { validation } from "../../middlewares/validation.middlware.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

const router = Router();

router.post(
  "/registerdc",
  validation(authdcValidation.registerDoctorSchema),
  asyncHandler(authdcServices.registerdc)
);

router.post(
  "/logindc",
  validation(authdcValidation.loginDoctorSchema),
  asyncHandler(authdcServices.logindc)
);

export default router;
