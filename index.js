import express from "express";
import bootstrap from "./body/src/app.controller.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join("./body/src/config/.env") });

const app = express();
bootstrap(app, express);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
