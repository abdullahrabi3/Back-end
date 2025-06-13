import { asyncHandler } from "../../middlewares/asyncHandler.js";
import UserModel from "../../DB/models/user.models.js";
import { compare } from "../../utils/hashing/hash.js";

/*export const getptofile = asyncHandler(async (req, res, next) => {
  //const { user } = req;

//  user.phone = decrypt({
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
});*/

export const editprofile = asyncHandler(async (req, res) => {
  const { name, email, password, newPassword } = req.body;

  const user = await UserModel.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // لو فيه باسورد لازم نتحقق من القديم
  if (password && newPassword) {
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong password" });
    }
    user.password = bcrypt.hashSync(newPassword, 10);
  }

  // تحديث الاسم والايميل إن وجد
  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated",
    data: {
      name: user.name,
      email: user.email,
    },
  });
});
