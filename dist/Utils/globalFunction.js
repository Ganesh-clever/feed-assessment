"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isSuperAdmin = exports.userAuth = exports.decryptPassword = exports.encryptPassword = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logHandler_1 = require("./logHandler");
// configs 
dotenv_1.default.config();
const secretKey = process.env.JWT_SECRETKEY;
const tokenExpiration = '24h';
// jwt generate token 
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: tokenExpiration });
};
exports.generateToken = generateToken;
// Password encryption
const encryptPassword = (payload) => {
    const salt = 10;
    return bcryptjs_1.default.hashSync(payload, salt);
};
exports.encryptPassword = encryptPassword;
// Decrypt password
const decryptPassword = (hashPassword, givenPassword) => {
    return bcryptjs_1.default.compareSync(givenPassword, hashPassword);
};
exports.decryptPassword = decryptPassword;
// Authentication middleware
const userAuth = (req, res, next) => {
    var _a;
    const auth = req.headers.authorization;
    if (auth) {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        jsonwebtoken_1.default.verify(token, secretKey, function (error, decoded) {
            if (error) {
                (0, logHandler_1.logOperation)('null', 'null', 'Authentication', "Invalid token entred.");
                res.status(401).json({ message: 'Invalid token entred.' });
            }
            else {
                req.user = decoded;
                next();
            }
        });
    }
    else {
        (0, logHandler_1.logOperation)('null', 'null', 'Authentication', "Authorization required.");
        res.status(500).json({ message: 'Authorization required.' });
    }
};
exports.userAuth = userAuth;
// check if the user is a super-admin
const isSuperAdmin = (user) => {
    return user.role === 'super-admin';
};
exports.isSuperAdmin = isSuperAdmin;
// check if the user is an admin
const isAdmin = (user) => {
    return user.role === 'admin';
};
exports.isAdmin = isAdmin;
