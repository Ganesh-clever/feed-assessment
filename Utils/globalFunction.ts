//imports
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
import bcrypt from 'bcryptjs';
import { logOperation } from './logHandler';

// configs 
env.config();
const secretKey: any = process.env.JWT_SECRETKEY;
const tokenExpiration = '24h';

// jwt generate token 
const generateToken = (payload: Object) => {
    return jwt.sign(payload, secretKey, { expiresIn: tokenExpiration });
};

// Password encryption
const encryptPassword = (payload: any) => {
    const salt = 10;
    return bcrypt.hashSync(payload, salt);
}

// Decrypt password
const decryptPassword = (hashPassword: string, givenPassword: string) => {
    return bcrypt.compareSync(givenPassword, hashPassword);
}

// Authentication middleware
const userAuth = (req: Request | any, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (auth) {
        const token: any = req.headers.authorization?.split(" ")[1];
        jwt.verify(token, secretKey, function (error: any, decoded: any) {
            if (error) {
                logOperation('null', 'null', 'Authentication', "Invalid token entred.");
                res.status(401).json({ message: 'Invalid token entred.' });
            } else {
                req.user = decoded;
                next();
            }
        })
    } else {
        logOperation('null', 'null', 'Authentication', "Authorization required.");
        res.status(500).json({ message: 'Authorization required.' })
    }
}

// check if the user is a super-admin
const isSuperAdmin = (user: any): boolean => {
    return user.role === 'super-admin';
};

// check if the user is an admin
const isAdmin = (user: any): boolean => {
    return user.role === 'admin';
};


export { generateToken, encryptPassword, decryptPassword, userAuth, isSuperAdmin, isAdmin };