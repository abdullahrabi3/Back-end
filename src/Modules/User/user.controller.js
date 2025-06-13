import { Router } from "express";
import * as userservices from "./user.services.js";
import * as uservalidation from "./user.validation.js";

import { authentication, allowTo } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middlware.js";

const router = Router();

// ✅ تعديل شامل للبروفايل (name, email, password, newPassword)
router.patch(
  "/editprofile",
  authentication,
  allowTo(["User", "Admin"]),
  validation(uservalidation.editprofileSchema),
  userservices.editprofile
);

// ✅ تعديل الاسم فقط
/*router.patch(
  "/name",
  authentication,
  allowTo(["User", "Admin"]),
  userservices.updateName
);

// ✅ تعديل الإيميل فقط
router.patch(
  "/email",
  authentication,
  allowTo(["User", "Admin"]),
  userservices.updateEmail
);

// ✅ تعديل كلمة المرور فقط
router.patch(
  "/password",
  authentication,
  allowTo(["User", "Admin"]),
  userservices.updatePassword
);*/

export default router;
