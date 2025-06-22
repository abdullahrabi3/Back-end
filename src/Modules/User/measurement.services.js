import MeasurementModel from "../../DB/models/measurement.model.js"; // لو عندك موديل
import Usermodel from "../../DB/models/user.models.js"; // عشان تتأكد من اليوزر

export const receiveLiveMeasurements = async (req, res, next) => {
  const { ecg, weight, muscle, fat, bloodSugar } = req.body;
  const userId = req.user._id;

  // من غير تخزين
  const measurements = { ecg, weight, muscle, fat, bloodSugar };

  // شروط تعتبر القياس خاطئ:
  const abnormal =
    ecg > 150 ||
    ecg < 50 ||
    weight < 30 ||
    weight > 200 ||
    muscle < 10 ||
    muscle > 80 ||
    fat > 50 ||
    bloodSugar > 180 ||
    bloodSugar < 70;

  // لو فيه قيم شاذة، خزّنها
  if (abnormal) {
    await MeasurementModel.create({ user: userId, ...measurements });
  }

  // رجّع القيم للـ Front
  return res.status(200).json({
    key: true,
    code: 200,
    message: abnormal ? "Abnormal reading detected!" : "Live data received",
    abnormal,
    data: measurements,
  });
};
