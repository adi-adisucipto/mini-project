import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { createCustomError } from "../utils/customError";
import { SECRET_KEY } from "../configs/env.config";

export interface Token {
    email: string;
    username: string;
    password: string;
    role:string;
    avatar: string;
    referral: string;
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
        const decode = verify(token, SECRET_KEY) as Token;

        req.user = decode;
    } catch (error) {
        next(error);
    }
}