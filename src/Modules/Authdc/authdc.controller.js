import { Router } from "express";
import * as authdcServices from "./authdc.services.js";
import { validation } from "../../middlewares/validation.middlware.js";
import * as authdcValidation from "./authdc.validation.js";

const router = Router();

router.post(
  "/registerdc",
  validation(authdcValidation.registerSchema),
  authdcServices.registerdc
);
router.post(
  "/logindc",
  validation(authdcValidation.loginSchema),
  authdcServices.logindc
);

export default router;
