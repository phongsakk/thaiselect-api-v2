import express, { Request, Response } from "express";
import IndexController from "../controllers/IndexController";

const Routes = express.Router();

Routes.get("/", (req: Request, res: Response) => {
  console.log("GET /");
  res.send("Express + TypeScript Server");
});

Routes.post("/me", IndexController.me);
Routes.post("/checkuser", IndexController.checkuser);
Routes.post("/register.php", IndexController.register);
Routes.post("/set_as_consent", IndexController.setAsConsent);

export default Routes;
