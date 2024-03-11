import { NextFunction, Request, Response } from "express";

const LogRoutes = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.method.toLocaleUpperCase() + " " + req.url.toString());
  next();
};

export default LogRoutes;
