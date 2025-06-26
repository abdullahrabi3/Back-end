import DoctorModel from "../../DB/models/doctor.models.js";
import UserModel from "../../DB/models/user.models.js";

// الدكتور يقوم بالحصول على المرضى المشتركين في حسابه
export const getSubscribedUsers = async (req, res, next) => {
  const doctor = await DoctorModel.findById(req.user._id).populate(
    "patients",
    "name email age gender"
  );

  if (!doctor) return next(new Error("Doctor not found", { cause: 404 }));

  const totalUsers = await UserModel.countDocuments(); // كل المرضى في السيستم
  const subscribedCount = doctor.patients.length; // عدد المرضى المشتركين مع الدكتور

  return res.status(200).json({
    key: true,
    code: 200,
    message: "Subscribed users fetched",
    date: {
      totalUsers,
      subscribedUsers: subscribedCount,
      patients: doctor.patients,
    }, // تفاصيل المرضى المشتركين
  });
};
