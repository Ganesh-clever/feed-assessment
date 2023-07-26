"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports 
const express_1 = __importDefault(require("express"));
const globalFunction_1 = require("../Utils/globalFunction");
const userController_1 = require("../Controllers/userController");
const router = express_1.default.Router();
// Routers
router.post('/super-admin/create', userController_1.createSuperAdmin);
router.post('/login', userController_1.Login);
router.post('/user/create', globalFunction_1.userAuth, userController_1.createUser);
router.get('/get-user/:userId', globalFunction_1.userAuth, userController_1.getUserDetails);
router.post('/update-user/:userId', globalFunction_1.userAuth, userController_1.updateUser);
router.delete('/delete-user/:userId', globalFunction_1.userAuth, userController_1.deleteUser);
router.get('/view-log', globalFunction_1.userAuth, userController_1.viewLogDetails);
router.post('/grant-access', globalFunction_1.userAuth, userController_1.giveFeedAccess);
exports.default = router;
