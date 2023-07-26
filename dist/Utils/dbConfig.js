"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = __importDefault(require("../Models/userModel"));
const feedModel_1 = __importDefault(require("../Models/feedModel"));
const userFeedModel_1 = __importDefault(require("../Models/userFeedModel"));
// Config
dotenv_1.default.config();
// DB connectivity
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DATABASE,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    dialect: 'mysql',
    models: [userModel_1.default, feedModel_1.default, userFeedModel_1.default],
});
sequelize.sync().then(() => {
    console.log('Database synced successfully.');
});
exports.default = sequelize;
