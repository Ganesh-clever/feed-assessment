// Imports
import { Request, Response } from 'express';
import Feed from '../Models/feedModel';
import User from '../Models/userModel';
import UserFeed from '../Models/userFeedModel';
import { isAdmin, isSuperAdmin } from '../Utils/globalFunction';
import { logOperation } from '../Utils/logHandler';

const createFeed = async (req: Request | any, res: Response) => {
    try {
        if (!isSuperAdmin(req.user)) {
            logOperation(req.user.id, req.user.role, 'createFeed Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to create the feed." });
        }
        const { name, url, description } = req.body;
        const feed = await Feed.create<any>({ name, url, description });
        return res.status(201).json({ message: 'Feed created successfully', feed });
    } catch (err) {
        logOperation(req.user.id, req.user.role, 'createFeed Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getFeedDetails = async (req: Request | any, res: Response) => {
    try {
        const feedId = req.params.feedId;
        const feed = await Feed.findByPk(feedId);
        const user: any = await User.findByPk(req.user.id, { include: Feed });
        if (!isSuperAdmin(req.user) && !user.hasAccessToFeed(parseInt(feedId))) {
            logOperation(req.user.id, req.user.role, 'getFeedDetails Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to see the feed." });
        }
        if (!feed) {
            return res.status(404).json({ message: 'Feed not found' });
        }
        return res.status(200).json({ data: feed });
    } catch (err) {
        logOperation(req.user.id, req.user.role, 'getFeedDetails Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getAllFeedDetails = async (req: Request | any, res: Response) => {
    try {
        const feed = await Feed.findAll();
        if (!isSuperAdmin(req.user)) {
            logOperation(req.user.id, req.user.role, 'getAllFeedDetails Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to see the feed." });
        }
        if (!feed) {
            return res.status(404).json({ message: 'Feed not found' });
        }
        return res.json({ feed });
    } catch (err) {
        logOperation(req.user.id, req.user.role, 'getAllFeedDetails Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateFeed = async (req: Request | any, res: Response) => {
    try {
        if (!isSuperAdmin(req.user)) {
            logOperation(req.user.id, req.user.role, 'updateFeed Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to update the feed." });
        }
        const feedId = req.params.feedId;
        const { name, url, description } = req.body;
        const feed = await Feed.findByPk(feedId);
        if (!feed) {
            return res.status(404).json({ message: 'Feed not found' });
        }
        await feed.update({ name, url, description });
        return res.json({ message: 'Feed updated successfully', feed });
    } catch (err) {
        logOperation(req.user.id, req.user.role, 'updateFeed Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteFeed = async (req: Request | any, res: Response) => {
    try {
        const feedId = req.params.feedId;
        const feed = await Feed.findByPk(feedId);
        const userFeed: any = await UserFeed.findOne({ where: { userId: req.user.id, feedId: feedId } })
        if (!feed) {
            logOperation(req.user.id, req.user.role, 'deleteFeed Api', "Feed not found");
            return res.status(404).json({ message: 'Feed not found' });
        }
        if (!isSuperAdmin(req.user) && !isAdmin(req.user)) {
            logOperation(req.user.id, req.user.role, 'deleteFeed Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to delete the feed." });
        }
        if (isSuperAdmin(req.user)) {
            await feed.destroy();
            return res.json({ message: 'Feed deleted successfully' });
        }
        if (userFeed !== undefined && userFeed?.dataValues?.accessType === 'delete') {
            await feed.destroy();
        } else {
            return res.status(403).json({ message: "You don't have the privileges to delete the feed." });
        }
        return res.json({ message: 'Feed deleted successfully' });
    } catch (err) {
        logOperation(req.user.id, req.user.role, 'deleteFeed Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { createFeed, getFeedDetails, updateFeed, deleteFeed, getAllFeedDetails };
