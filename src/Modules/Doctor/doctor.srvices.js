import DoctorModel from "../../DB/models/doctor.models.js";

// الدكتور يقوم بالحصول على المرضى المشتركين في حسابه
export const getSubscribedUsers = async (req, res, next) => {
  const doctor = await DoctorModel.findById(req.user._id).populate(
    "patients",
    "name email age gender"
  );

  if (!doctor) return next(new Error("Doctor not found", { cause: 404 }));

  return res.status(200).json({
    key: true,
    code: 200,
    message: "Subscribed users fetched",
    data: doctor.patients,
  });
};
