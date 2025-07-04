import express from "express";
import bootstrap from "./src/app.controller.js";
import dotenv from "dotenv";
import path from "path";
import "./src/DB/models/field.models.js";

dotenv.config({ path: path.join("./src/config/.env") });

const app = express();
bootstrap(app, express);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
