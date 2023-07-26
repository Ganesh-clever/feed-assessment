"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports 
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConfig_1 = __importDefault(require("./Utils/dbConfig"));
const app = (0, express_1.default)();
// Configs
dotenv_1.default.config();
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
// Log Remover every 30 min
const cleanupInterval = 30 * 60 * 1000;
setInterval(() => {
    (0, logHandler_1.autoDeleteOldLogs)(cleanupInterval);
}, cleanupInterval);
// Apis 
const userRouter_1 = __importDefault(require("./Routers/userRouter"));
const feedRouter_1 = __importDefault(require("./Routers/feedRouter"));
const logHandler_1 = require("./Utils/logHandler");
app.use('/api', userRouter_1.default);
app.use('/api', feedRouter_1.default);
// Listsen server 
app.listen(process.env.PORT, () => {
    console.log(`Server is running with port : ${process.env.PORT}`);
    dbConfig_1.default.authenticate().then(() => {
        console.log('DB connected successfully.');
    }).catch((err) => {
        console.log('Error with connect.');
    });
});
