import { Router } from "express";
import * as userservices from "./user.services.js";
import * as uservalidation from "./user.validation.js";
import { subscribeToDoctor, unsubscribeFromDoctor } from "./user.services.js";
import { authentication, allowTo } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middlware.js";
import { getDoctorsForUser } from "./user.services.js";
import { getMyDoctors } from "./user.services.js";
import { addMeasurement, getMyMeasurements } from "./user.services.js";
import { receiveLiveMeasurements } from "./measurement.services.js";
import asyncHandler from "express-async-handler";

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
// src/Modules/User/user.router.js

router.get(
  "/doctors",
  authentication,
  allowTo("User"), // لو محتاج صلاحيات معينة
  asyncHandler(getDoctorsForUser)
);

//  اشتراك اليوزر للدكتور
router.post(
  "/subscribe/:doctorId",
  authentication,
  allowTo("User"),
  subscribeToDoctor
);

// الغاء الاشتراك
router.delete(
  "/unsubscribe/:doctorId",
  authentication,
  allowTo("User"),
  unsubscribeFromDoctor
);

// عرض الدكاترة المشترك معهم
router.get("/mydoctors", authentication, allowTo("User"), getMyDoctors);

// إضافة قياسات جديدة
router.post(
  "/add-measurement",
  authentication,
  allowTo("User"),
  addMeasurement
);

// عرض القياسات
router.get(
  "/my-measurements",
  authentication,
  allowTo("User"),
  getMyMeasurements
);

// جلب قياسات المستخدم
router.post(
  "/live-measurement",
  authentication,
  allowTo("User"),
  receiveLiveMeasurements
);

export default router;
