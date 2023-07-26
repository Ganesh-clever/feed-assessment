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
exports.getAllFeedDetails = exports.deleteFeed = exports.updateFeed = exports.getFeedDetails = exports.createFeed = void 0;
const feedModel_1 = __importDefault(require("../Models/feedModel"));
const userModel_1 = __importDefault(require("../Models/userModel"));
const userFeedModel_1 = __importDefault(require("../Models/userFeedModel"));
const globalFunction_1 = require("../Utils/globalFunction");
const logHandler_1 = require("../Utils/logHandler");
const createFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, globalFunction_1.isSuperAdmin)(req.user)) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'createFeed Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to create the feed." });
        }
        const { name, url, description } = req.body;
        const feed = yield feedModel_1.default.create({ name, url, description });
        return res.status(201).json({ message: 'Feed created successfully', feed });
    }
    catch (err) {
        (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'createFeed Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.createFeed = createFeed;
const getFeedDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedId = req.params.feedId;
        const feed = yield feedModel_1.default.findByPk(feedId);
        const user = yield userModel_1.default.findByPk(req.user.id, { include: feedModel_1.default });
        if (!(0, globalFunction_1.isSuperAdmin)(req.user) && !user.hasAccessToFeed(parseInt(feedId))) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'getFeedDetails Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to see the feed." });
        }
        if (!feed) {
            return res.status(404).json({ message: 'Feed not found' });
        }
        return res.status(200).json({ data: feed });
    }
    catch (err) {
        (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'getFeedDetails Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getFeedDetails = getFeedDetails;
const getAllFeedDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feed = yield feedModel_1.default.findAll();
        if (!(0, globalFunction_1.isSuperAdmin)(req.user)) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'getAllFeedDetails Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to see the feed." });
        }
        if (!feed) {
            return res.status(404).json({ message: 'Feed not found' });
        }
        return res.json({ feed });
    }
    catch (err) {
        (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'getAllFeedDetails Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getAllFeedDetails = getAllFeedDetails;
const updateFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, globalFunction_1.isSuperAdmin)(req.user)) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'updateFeed Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to update the feed." });
        }
        const feedId = req.params.feedId;
        const { name, url, description } = req.body;
        const feed = yield feedModel_1.default.findByPk(feedId);
        if (!feed) {
            return res.status(404).json({ message: 'Feed not found' });
        }
        yield feed.update({ name, url, description });
        return res.json({ message: 'Feed updated successfully', feed });
    }
    catch (err) {
        (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'updateFeed Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.updateFeed = updateFeed;
const deleteFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const feedId = req.params.feedId;
        const feed = yield feedModel_1.default.findByPk(feedId);
        const userFeed = yield userFeedModel_1.default.findOne({ where: { userId: req.user.id, feedId: feedId } });
        if (!feed) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'deleteFeed Api', "Feed not found");
            return res.status(404).json({ message: 'Feed not found' });
        }
        if (!(0, globalFunction_1.isSuperAdmin)(req.user) && !(0, globalFunction_1.isAdmin)(req.user)) {
            (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'deleteFeed Api', "You don't have the privileges to give access to any user.");
            return res.status(403).json({ message: "You don't have the privileges to delete the feed." });
        }
        if ((0, globalFunction_1.isSuperAdmin)(req.user)) {
            yield feed.destroy();
            return res.json({ message: 'Feed deleted successfully' });
        }
        if (userFeed !== undefined && ((_a = userFeed === null || userFeed === void 0 ? void 0 : userFeed.dataValues) === null || _a === void 0 ? void 0 : _a.accessType) === 'delete') {
            yield feed.destroy();
        }
        else {
            return res.status(403).json({ message: "You don't have the privileges to delete the feed." });
        }
        return res.json({ message: 'Feed deleted successfully' });
    }
    catch (err) {
        (0, logHandler_1.logOperation)(req.user.id, req.user.role, 'deleteFeed Api', "Internal Server Error");
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.deleteFeed = deleteFeed;
