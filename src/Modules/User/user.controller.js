import { Router } from "express";
import * as userservices from "./user.services.js";
import * as uservalidation from "./user.validation.js";
import { authentication, allowTo } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middlware.js";

const router = Router();

/*router.get(
  "/profile",
  authentication,
  allowTo(["User", "Admin"]),
  userservices.getptofile
);*/

//Edit profile

router.patch(
  "/",
  authentication, // تأكد إنه يضيف req.user
  allowTo(["User", "Admin"]),
  validation(uservalidation.editprofileSchema),
  userservices.editprofile
);

//change password

/*router.patch(
  "/changepassword",
  authentication,
  allowTo(["User", "Admin"]),
  validation(uservalidation.changepassword),
  userservices.changepassword
);

router.delete(
  "/",
  authentication,
  allowTo(["User", "Admin"]),
  userservices.deleteUser
);*/

export default router;
