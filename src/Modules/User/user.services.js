import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../../DB/models/user.models.js";
import DoctorModel from "./../../DB/models/doctor.models.js";
import MeasurementModel from "./../../DB/models/measurement.model.js";

export const editprofile = asyncHandler(async (req, res, next) => {
  const { name, email, password, newPassword } = req.body;

  const updates = {};

  // تحديث الاسم
  if (name) updates.name = name;

  // تحديث الإيميل
  if (email) updates.email = email;

  const user = await UserModel.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      key: false,
      code: 404,
      message: "User not found",
    });
  }

  // لو المستخدم عايز يغيّر الباسورد
  if (newPassword) {
    if (!password) {
      return res.status(400).json({
        key: false,
        code: 400,
        message: "Current password is required to change password",
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        key: false,
        code: 400,
        message: "Incorrect current password",
      });
    }

    updates.password = bcrypt.hashSync(newPassword, 10);
  }

  // تحديث البيانات في قاعدة البيانات
  const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  // إنشاء توكن جديد بعد التعديل
  const token = jwt.sign(
    { id: updatedUser._id },
    process.env.TOKEN_SECRIT_USER,
    {
      expiresIn: "7d",
    }
  );

  return res.status(200).json({
    key: true,
    code: 200,
    message: "Profile updated successfully",
    data: {
      name: updatedUser.name,
      email: updatedUser.email,
      newPassword: updatedUser.password,
      token: token,
    },
  });
});

// ✅ تحديث الاسم فقط
/*export const updateName = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      key: false,
      code: 400,
      message: "Name is required",
    });
  }

  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { name },
    { new: true }
  );

  res.status(200).json({
    key: true,
    code: 200,
    message: "Name updated successfully",
    data: { name: user.name },
  });
});

// ✅ تحديث البريد الإلكتروني فقط
export const updateEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      key: false,
      code: 400,
      message: "Email is required",
    });
  }

  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { email },
    { new: true }
  );

  res.status(200).json({
    key: true,
    code: 200,
    message: "Email updated successfully",
    data: { email: user.email },
  });
});

// ✅ تحديث كلمة المرور فقط
export const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      key: false,
      code: 400,
      message: "Old and new passwords are required",
    });
  }

  const user = await UserModel.findById(req.user._id);
  const isMatch = bcrypt.compareSync(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({
      key: false,
      code: 400,
      message: "Incorrect current password",
    });
  }

  user.password = bcrypt.hashSync(newPassword, 10);
  await user.save();

  res.status(200).json({
    key: true,
    code: 200,
    message: "Password updated successfully",
  });
});*/
// src/Modules/User/user.services.js

export const getDoctorsForUser = async (req, res, next) => {
  const userId = req.user._id;

  const doctors = await DoctorModel.find()
    .select("-password")
    .populate("field", "name"); // يجلب فقط حقل name من الوثيقة المرتبطة

  return res.status(200).json({
    key: true,
    code: 200,
    message: "Doctors fetched successfully",
    data: doctors.map((doc) => ({
      id: doc._id,
      name: doc.name,
      email: doc.email,
      gender: doc.gender,
      age: doc.age,
      field: doc.field?.name || "Unknown", // اسم التخصص فقط
      certificates: doc.certificates || [],
      services: doc.services || [],
      rating: doc.rating,
      patients: Array.isArray(doc.patients) ? doc.patients.length : 0,
      subscribe:
        Array.isArray(doc.patients) &&
        doc.patients.some((p) => p.toString() === userId.toString()),
    })),
  });
};

// الاشتراك في دكتور
export const subscribeToDoctor = async (req, res, next) => {
  const doctorId = req.params.doctorId;
  const userId = req.user._id;

  const doctor = await DoctorModel.findById(doctorId);
  const user = await UserModel.findById(userId);

  if (!doctor || !user) {
    return next(new Error("Doctor or User not found", { cause: 404 }));
  }

  // تأكد أن patients مصفوفة
  if (!Array.isArray(doctor.patients)) {
    doctor.patients = [];
  }

  // تأكد أن subscribedDoctors مصفوفة أيضاً
  if (!Array.isArray(user.subscribedDoctors)) {
    user.subscribedDoctors = [];
  }

  if (!user.subscribedDoctors.includes(doctorId)) {
    user.subscribedDoctors.push(doctorId);
    doctor.patients.push(userId);
    await user.save();
    await doctor.save();
  }

  return res.status(200).json({
    key: true,
    code: 200,
    message: "Subscribed successfully",
  });
};

// إلغاء الاشتراك
export const unsubscribeFromDoctor = async (req, res, next) => {
  const doctorId = req.params.doctorId;
  const userId = req.user._id;

  const doctor = await DoctorModel.findById(doctorId);
  const user = await UserModel.findById(userId);

  if (!doctor || !user) {
    return next(new Error("Doctor or User not found", { cause: 404 }));
  }

  // تأكيد المصفوفات
  if (!Array.isArray(user.subscribedDoctors)) user.subscribedDoctors = [];
  if (!Array.isArray(doctor.patients)) doctor.patients = [];

  const wasSubscribed = user.subscribedDoctors.some(
    (id) => id.toString() === doctorId.toString()
  );

  if (!wasSubscribed) {
    return res.status(400).json({
      key: false,
      code: 400,
      message: "User is not subscribed to this doctor",
    });
  }

  user.subscribedDoctors = user.subscribedDoctors.filter(
    (id) => id.toString() !== doctorId.toString()
  );

  doctor.patients = doctor.patients.filter(
    (id) => id.toString() !== userId.toString()
  );

  await user.save();
  await doctor.save();

  return res.status(200).json({
    key: true,
    code: 200,
    message: "Unsubscribed successfully",
  });
};

// عرض الدكاترة المشترك معهم
export const getMyDoctors = async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate(
    "subscribedDoctors",
    "name email field"
  );

  res.status(200).json({
    key: true,
    code: 200,
    message: "Subscribed doctors",
    data: user.subscribedDoctors,
  });
};

// إضافة قياسات جديدة
export const addMeasurement = async (req, res, next) => {
  const { ecg, weight, muscle, fat, bloodSugar } = req.body;
  const userId = req.user._id;

  const measurement = await MeasurementModel.create({
    user: userId,
    ecg,
    weight,
    muscle,
    fat,
    bloodSugar,
  });

  res.status(201).json({
    key: true,
    code: 201,
    message: "Measurement recorded successfully",
    data: measurement,
  });
};

// جلب قياسات المستخدم
export const getMyMeasurements = async (req, res, next) => {
  const measurements = await MeasurementModel.find({ user: req.user._id });

  res.status(200).json({
    key: true,
    code: 200,
    message: "Measurements fetched successfully",
    data: measurements,
  });
};
