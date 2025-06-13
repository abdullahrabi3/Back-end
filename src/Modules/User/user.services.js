import { asyncHandler } from "../../middlewares/asyncHandler.js";
import UserModel from "../../DB/models/user.models.js";
import { compare } from "../../utils/hashing/hash.js";

export const getptofile = asyncHandler(async (req, res, next) => {
  const { user } = req;

  user.phone = decrypt({
    encrpted: user.phone,
    sign: process.env.ENCRIPTION_SECRIT,
  });
  return res
    .status(200)
    .json({ key: true, code: 200, message: "user profile", date: user });
});

export const editprofile = asyncHandler(async (req, res, next) => {
  if (req.body.phone) {
    req.body.phone = encrypt({
      plainTixt: req.body.phone,
      signature: process.env.ENCRIPTION_SECRIT,
    });
  }

  const editUser = await UserModel.findOneAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true, runValidators: true }
  );
  return req.status(200).json({
    key: true,
    code: 200,
    message: "user updated",
    result: { user: editUser },
  });
});

export const changepassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const compareHash = compare({
    plainTixt: oldPassword,
    hash: req.user.password,
  });

  if (!compareHash) return next(new Error("invalid password", { cause: 400 }));
  const hashedPassword = hash({ plainTixt: newPassword });
  const editUser = await UserModel.findOneAndUpdate(
    req.user._id,
    { password: hashedPassword },
    { new: true, runValidators: true }
  );

  return req.status(200).json({
    success: true,
    message: "password updated successfully",
    result: { user: editUser },
  });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndDelete(
    req.user._id,
    {
      isDleted: true,
      changdAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );
  return req.status(200).json({
    key: success,
    message: "user deleted successfully",

    result: { user },
  });
});
