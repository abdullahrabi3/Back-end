import { getSubscribedUsers } from "./doctor.srvices.js";
import { Router } from "express";
import { authentication, allowTo } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/subscribers",
  authentication,
  allowTo("Doctor"),
  getSubscribedUsers
);

export default router;
