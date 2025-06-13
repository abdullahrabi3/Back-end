import connectDB from "./DB/conection.js";
import authRouter from "./Modules/Auth/auth.controller.js";
import massegeRouter from "./Modules/Masseges/massege.controller.js";
import userRouter from "./Modules/User/user.controller.js";

import cors from "cors";

const bootstrap = async (app, express) => {
  await connectDB();

  app.use(cors());

  app.use(express.json());

  app.use("/auth", authRouter);
  app.use("/massege", massegeRouter);
  app.use("/user", userRouter);

  app.all("*", (req, res, next) => {
    return next(new Error("route not found", { cause: 404 }));
  });
  app.use((error, req, res, next) => {
    const status = error.cause || 500;
    return res
      .status(status)
      .json({ success: false, massage: error.massage, stack: error.stack });
  });
};

export default bootstrap;
