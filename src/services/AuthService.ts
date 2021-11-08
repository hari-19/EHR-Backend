import jwt from "jsonwebtoken";
import { Request, Response } from 'express';
import { UserRequest } from '../types/authTypes';

/**
 * Generates JWT Access Token for the data
 * @param obj User Object Data
 * @returns JWT Token
 */
export function generateAccessToken(obj: any) {
    return jwt.sign(obj, process.env.TOKEN_SECRET, {expiresIn: '21600s'});
}

export function authenticateToken(req: UserRequest, res:Response, next: any){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) {
            return next(err);
        }

        req.user = user;
    })
}

/**
 * Authentication Middleware for JWT Token
 */
export function authenticateJWT(req: UserRequest, res: Response, next: any) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};