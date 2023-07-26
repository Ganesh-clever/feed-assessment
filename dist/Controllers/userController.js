"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewLogDetails = exports.giveFeedAccess = exports.deleteUser = exports.updateUser = exports.getUserDetails = exports.Login = exports.createUser = exports.createSuperAdmin = void 0;
const userModel_1 = __importDefault(require("../Models/userModel"));
const globalFunction_1 = require("../Utils/globalFunction");
const feedModel_1 = __importDefault(require("../Models/feedModel"));
const userFeedModel_1 = __importDefault(require("../Models/userFeedModel"));
const logHandler_1 = require("../Utils/logHandler");
const createSuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password, email, role } = req.body;
    try {
        const existingSuperAdmin = yield userModel_1.default.findOne({ where: { role: 'super-admin' } });
        if (!existingSuperAdmin) {
            const hashedPassword = yield (0, globalFunction_1.encryptPassword)(password);
            yield userModel_1.default.create({
                name: name,
                role: role,
                email: email,
                password: hashedPassword,
            }).then((user) => {
                return res.status(201).json({ Message: 'Super Admin created successfully.', userData: user });
            });
        }
        else {
            return res.status(409).json({ Message: 'Super Admin already exists.' });
        }
    }
    catch (err) {
        return res.status(500).json({ Message: 'Internal server issues.' });
    }
});
exports.createSuperAdmin = createSuperAdmin;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield userModel_1.default.findOne({ where: { email: email } });
        if (existingUser) {
            const vaildPassword = yield (0, globalFunction_1.decryptPassword)(existingUser.password, password);
            if (vaildPassword) {
                const token = (0, globalFunction_1.generateToken)(existingUser.dataValues);
                return res.status(200).json({
                    Message: 'Login successfully.',
                    userData: existingUser,
                    token: token
                });
            }
            else {
                return res.status(400).json({ message: 'Invaild password entred.' });
            }
        }
        else {
            return res.status(404).json({ Message: 'User not exists.' });
        }
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal server issues' });
    }
});
exports.Login = Login;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, role, email, password } = req.body;
        if (!(0, globalFunction_1.isSuperAdmin)(req.user) && !(0, globalFunction_1.isAdmin)(req.user)) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'createUser Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to create user." });
        }
        const existingUser = yield userModel_1.default.findOne({ where: { email } });
        if (existingUser) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'createUser Api', "User already exists");
            return res.status(409).json({ message: 'User already exists' });
        }
        if (req.user.role !== role && role !== 'super-admin') {
            const hashedPassword = yield (0, globalFunction_1.encryptPassword)(password);
            const user = yield userModel_1.default.create({
                name,
                role,
                email,
                password: hashedPassword,
            });
            return res.status(201).json({ message: 'User created successfully', user });
        }
        else {
            return res.status(403).json({ message: "Admin can't able to create the admin user or super admin." });
        }
    }
    catch (err) {
        (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'createUser Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.createUser = createUser;
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield userModel_1.default.findByPk(userId);
        if (!(0, globalFunction_1.isSuperAdmin)(req.user) && req.user.id !== userId) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'getUserDetails Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to see the user." });
        }
        if (!user) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'getUserDetails Api', "User or feed not found");
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    }
    catch (err) {
        (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'getUserDetails Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getUserDetails = getUserDetails;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const { name, role, email } = req.body;
        const user = yield userModel_1.default.findByPk(userId);
        if (!(0, globalFunction_1.isSuperAdmin)(req.user) && req.user.id !== userId) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'updateUser Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to update the user." });
        }
        if (!user) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'updateUser Api', "User or feed not found");
            return res.status(404).json({ message: 'User not found' });
        }
        yield user.update({ name, role, email });
        return res.status(200).json({ message: 'User updated successfully', user });
    }
    catch (err) {
        (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'updateUser Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield userModel_1.default.findByPk(userId);
        if (!(0, globalFunction_1.isSuperAdmin)(req.user) && !(0, globalFunction_1.isAdmin)(req.user) && req.user.id !== userId) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'deleteUser Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to delete the user." });
        }
        if (!user) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'deleteUser Api', "User or feed not found");
            return res.status(404).json({ message: 'User not found' });
        }
        if (req.user.role !== user.role || (0, globalFunction_1.isSuperAdmin)(req.user)) {
            yield user.destroy();
            return res.status(200).json({ message: 'User deleted successfully' });
        }
        else {
            return res.status(403).json({ message: "Admin can't able to delete the admin user or super admin." });
        }
    }
    catch (err) {
        (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'deleteUser Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.deleteUser = deleteUser;
const giveFeedAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, feedId, accessType } = req.body;
        const user = yield userModel_1.default.findByPk(userId, { include: feedModel_1.default });
        const feed = yield feedModel_1.default.findByPk(feedId);
        const admin = yield userModel_1.default.findByPk(req.user.id, { include: feedModel_1.default });
        if (!(0, globalFunction_1.isSuperAdmin)(req.user) && (!(0, globalFunction_1.isAdmin)(req.user) && req.user.id !== userId)) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'giveFeedAccess Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to give access to any user." });
        }
        if (!user || !feed) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'giveFeedAccess Api', "User or feed not found");
            return res.status(404).json({ message: 'User or feed not found' });
        }
        if (req.user.role !== user.role || (0, globalFunction_1.isSuperAdmin)(req.user)) {
            if (!user.hasAccessToFeed(feedId) && (0, globalFunction_1.isSuperAdmin)(req.user)) {
                yield userFeedModel_1.default.create({ userId, feedId, accessType });
            }
            else {
                const userFeed = yield userFeedModel_1.default.findOne({ where: { userId, feedId } });
                yield (userFeed === null || userFeed === void 0 ? void 0 : userFeed.update({ accessType }));
            }
            if (!admin.hasAccessToFeed(feedId) && (0, globalFunction_1.isAdmin)(req.user)) {
                return res.status(403).json({ message: "You don't have access to give the access to the feed" });
            }
            else {
                if (admin.hasAccessToFeed(feedId)) {
                    yield userFeedModel_1.default.create({ userId: userId, feedId: feedId, accessType: 'read' });
                }
            }
            return res.status(200).json({ message: 'Feed access granted successfully' });
        }
        else {
            return res.status(403).json({ message: "Admin can't able to give the access to another admin." });
        }
    }
    catch (err) {
        (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'giveFeedAccess Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.giveFeedAccess = giveFeedAccess;
const viewLogDetails = (req, res) => {
    try {
        if (!(0, globalFunction_1.isSuperAdmin)(req.user)) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'viewLogDetails Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to give access to any user." });
        }
        const logs = (0, logHandler_1.readLogs)();
        return res.send(logs);
    }
    catch (err) {
        (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'viewLogDetails Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.viewLogDetails = viewLogDetails;
