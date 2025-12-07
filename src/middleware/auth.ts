import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          message: "Unauthorized Access",
        });
      }

      const decoded = jwt.verify(
        token,
        config.token_secret as string
      ) as JwtPayload;
      req.user = decoded as JwtPayload;
      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized Access",
        });
      }

      next();
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: err,
      });
    }
  };
};
