// src/index.js
import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import Routes from "./routes/index.routes";
import LogRoutes from "./middleware/LogRoutes";

const main = async () => {
  config();

  const app = express();
  const port = process.env.PORT;

  app.use(cors());
  app.use(express.json());
  app.use(LogRoutes);
  app.use(Routes);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

main();
