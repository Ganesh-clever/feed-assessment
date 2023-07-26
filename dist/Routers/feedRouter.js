"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const globalFunction_1 = require("../Utils/globalFunction");
const feedController_1 = require("../Controllers/feedController");
const router = express_1.default.Router();
router.post('/create/feed', globalFunction_1.userAuth, feedController_1.createFeed);
router.get('/get-feed/:feedId', globalFunction_1.userAuth, feedController_1.getFeedDetails);
router.get('/get-feed', globalFunction_1.userAuth, feedController_1.getAllFeedDetails);
router.post('/update-feed/:feedId', globalFunction_1.userAuth, feedController_1.updateFeed);
router.delete('/delete-feed/:feedId', globalFunction_1.userAuth, feedController_1.deleteFeed);
exports.default = router;
