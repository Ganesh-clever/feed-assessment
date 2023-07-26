import { Request, Response } from "express";
import User from "../Models/userModel";
import { decryptPassword, encryptPassword, generateToken, isAdmin, isSuperAdmin } from '../Utils/globalFunction';
import Feed from "../Models/feedModel";
import UserFeed from "../Models/userFeedModel";
import { logOperation, readLogs } from "../Utils/logHandler";

const createSuperAdmin = async (req: Request, res: Response) => {
    const { name, password, email, role } = req.body;
    try {
        const existingSuperAdmin = await User.findOne({ where: { role: 'super-admin' } });
        if (!existingSuperAdmin) {
            const hashedPassword = await encryptPassword(password);
            await User.create<any>({
                name: name,
                role: role,
                email: email,
                password: hashedPassword,
            }).then((user) => {
                return res.status(201).json({ Message: 'Super Admin created successfully.', userData: user })
            });
        } else {
            return res.status(409).json({ Message: 'Super Admin already exists.' })
        }
    } catch (err) {
        return res.status(500).json({ Message: 'Internal server issues.' })
    }
}

const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            const vaildPassword = await decryptPassword(existingUser.password, password);
            if (vaildPassword) {
                const token = generateToken(existingUser.dataValues);
                return res.status(200).json({
                    Message: 'Login successfully.',
                    userData: existingUser,
                    token: token
                });
            } else {
                return res.status(400).json({ message: 'Invaild password entred.' });
            }
        } else {
            return res.status(404).json({ Message: 'User not exists.' })
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal server issues' });
    }
}

const createUser = async (req: Request | any, res: Response) => {
    try {
        const { name, role, email, password } = req.body;
        if (!isSuperAdmin(req.user) && !isAdmin(req.user)) {
            logOperation(req.user.id, req.user.role, 'createUser Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to create user." });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            logOperation(req.user.id, req.user.role, 'createUser Api', "User already exists");
            return res.status(409).json({ message: 'User already exists' });
        }
        if (req.user.role !== role && role !== 'super-admin') {
            const hashedPassword = await encryptPassword(password);
            const user = await User.create<any>({
                name,
                role,
                email,
                password: hashedPassword,
            });
            return res.status(201).json({ message: 'User created successfully', user });
        } else {
            return res.status(403).json({ message: "Admin can't able to create the admin user or super admin." });
        }
    } catch (err) {
        logOperation(req.user.id, req.user.role, 'createUser Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getUserDetails = async (req: Request | any, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);
        if (!isSuperAdmin(req.user) && req.user.id !== userId) {
            logOperation(req.user.id, req.user.role, 'getUserDetails Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to see the user." });
        }
        if (!user) {
            logOperation(req.user.id, req.user.role, 'getUserDetails Api', "User or feed not found");
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (err) {
        logOperation(req.user.id, req.user.role, 'getUserDetails Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateUser = async (req: Request | any, res: Response) => {
    try {
        const userId = req.params.userId;
        const { name, role, email } = req.body;
        const user = await User.findByPk(userId);
        if (!isSuperAdmin(req.user) && req.user.id !== userId) {
            logOperation(req.user.id, req.user.role, 'updateUser Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to update the user." });
        }
        if (!user) {
            logOperation(req.user.id, req.user.role, 'updateUser Api', "User or feed not found");
            return res.status(404).json({ message: 'User not found' });
        }
        await user.update({ name, role, email });
        return res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        logOperation(req.user.id, req.user.role, 'updateUser Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteUser = async (req: Request | any, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);
        if (!isSuperAdmin(req.user) && !isAdmin(req.user) && req.user.id !== userId) {
            logOperation(req.user.id, req.user.role, 'deleteUser Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to delete the user." });
        }
        if (!user) {
            logOperation(req.user.id, req.user.role, 'deleteUser Api', "User or feed not found");
            return res.status(404).json({ message: 'User not found' });
        }
        if (req.user.role !== user.role || isSuperAdmin(req.user)) {
            await user.destroy();
            return res.status(200).json({ message: 'User deleted successfully' });
        } else {
            return res.status(403).json({ message: "Admin can't able to delete the admin user or super admin." });
        }
    } catch (err) {
        logOperation(req.user.id, req.user.role, 'deleteUser Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const giveFeedAccess = async (req: Request | any, res: Response) => {
    try {
        const { userId, feedId, accessType } = req.body;
        const user = await User.findByPk(userId, { include: Feed });
        const feed = await Feed.findByPk(feedId);
        const admin: any = await User.findByPk(req.user.id, { include: Feed });
        if (!isSuperAdmin(req.user) && (!isAdmin(req.user) && req.user.id !== userId)) {
            logOperation(req.user.id, req.user.role, 'giveFeedAccess Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to give access to any user." });
        }
        if (!user || !feed) {
            logOperation(req.user.id, req.user.role, 'giveFeedAccess Api', "User or feed not found");
            return res.status(404).json({ message: 'User or feed not found' });
        }
        if (req.user.role !== user.role || isSuperAdmin(req.user)) {
            if (!user.hasAccessToFeed(feedId) && isSuperAdmin(req.user)) {
                await UserFeed.create<any>({ userId, feedId, accessType });
            } else {
                const userFeed = await UserFeed.findOne({ where: { userId, feedId } });
                await userFeed?.update({ accessType });
            }
            if (!admin.hasAccessToFeed(feedId) && isAdmin(req.user)) {
                return res.status(403).json({ message: "You don't have access to give the access to the feed" });
            } else {
                if (admin.hasAccessToFeed(feedId)) {
                    await UserFeed.create<any>({ userId: userId, feedId: feedId, accessType: 'read' });
                }
            }
            return res.status(200).json({ message: 'Feed access granted successfully' });
        } else {
            return res.status(403).json({ message: "Admin can't able to give the access to another admin." });
        }
    } catch (err) {
        logOperation(req.user.id, req.user.role, 'giveFeedAccess Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const viewLogDetails = (req: Request | any, res: Response) => {
    try {
        if (!isSuperAdmin(req.user)) {
            logOperation(req.user.id, req.user.role, 'viewLogDetails Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to give access to any user." });
        }
        const logs = readLogs();
        return res.send(logs);
    } catch (err) {
        logOperation(req.user.id, req.user.role, 'viewLogDetails Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


export { createSuperAdmin, createUser, Login, getUserDetails, updateUser, deleteUser, giveFeedAccess, viewLogDetails };