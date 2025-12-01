import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { createCustomError } from "../utils/customError";
import { SECRET_ACCESS_KEY } from "../configs/env.config";

export interface Token {
    id: string,
    email: string,
    username: string,
    role: string,
    avatar: string,
    referral_code: string,
    points_balance: number
}

declare module "express-serve-static-core" {
    interface Request {
        user?: Token;
    }
}

export function authMiddleware(req:Request, res:Response, next:NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            throw createCustomError(401, "Unauthorized!");
        }

        const token = authHeader.split(" ")[1];
        console.log(token)
        const decode = verify(token, SECRET_ACCESS_KEY) as Token;

        req.user = decode as Token;

        next()
    } catch (error) {
        next(error);
    }
}

export function organizerOnly(req: Request, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== "ORGANIZER" && req.user.role !== "ADMIN")) {
    return next(createCustomError(403, "Organizer only")); // inget the forum where you got this and learn again
  }
  next();
}