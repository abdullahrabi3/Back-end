import connectDB from "./DB/conection.js";
import authRouter from "./Modules/Auth/auth.controller.js";
import authdcRouter from "./Modules/Authdc/authdc.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import doctorRouter from "./Modules/Doctor/doctor.controller.js";
import cors from "cors";

const bootstrap = async (app, express) => {
  await connectDB();

  app.use(cors());
  app.use(express.json());

  app.use("/auth", authRouter);
  app.use("/authdc", authdcRouter);
  app.use("/user", userRouter);
  app.use("/doctor", doctorRouter);

  app.all("*", (req, res, next) => {
    return next(new Error("Route not found", { cause: 404 }));
  });

  app.use((error, req, res, next) => {
    const status = error.cause || 500;
    return res.status(status).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  });
};

export default bootstrap;
