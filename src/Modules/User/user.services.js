import { asyncHandler } from "../../middlewares/asyncHandler.js";
import UserModel from "../../DB/models/user.models.js";
import bcrypt from "bcrypt";

// ✅ تعديل الملف الشخصي: name, email, password, newPassword
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

  const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    key: true,
    code: 200,
    message: "Profile updated successfully",
    data: {
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });
});

// ✅ تحديث الاسم فقط
export const updateName = asyncHandler(async (req, res) => {
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
});
