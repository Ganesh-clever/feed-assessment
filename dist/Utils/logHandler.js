"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoDeleteOldLogs = exports.readLogs = exports.logOperation = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LOG_DIRECTORY = path_1.default.join(__dirname, '../logs');
const logOperation = (userId, userRole, operation, message) => {
    const logData = `[${new Date().toISOString()}] User ID: ${userId}, Role: ${userRole}, Operation: ${operation}, Message: ${message}\n`;
    const logFileName = `ApiLogDetails.log`;
    const logFilePath = path_1.default.join(LOG_DIRECTORY, logFileName);
    fs_1.default.appendFile(logFilePath, logData, (err) => {
        if (err) {
            console.error('Error writing log:', err);
        }
    });
};
exports.logOperation = logOperation;
const readLogs = () => {
    const currentTime = new Date().getTime();
    const logFiles = fs_1.default.readdirSync(LOG_DIRECTORY).filter((logFile) => {
        const logFilePath = path_1.default.join(LOG_DIRECTORY, logFile);
        const fileStats = fs_1.default.statSync(logFilePath);
        const fileCreationTime = fileStats.ctime.getTime();
        return currentTime - fileCreationTime <= 5 * 60 * 1000;
    }).sort((a, b) => {
        const statA = fs_1.default.statSync(path_1.default.join(LOG_DIRECTORY, a));
        const statB = fs_1.default.statSync(path_1.default.join(LOG_DIRECTORY, b));
        return statB.mtime.getTime() - statA.mtime.getTime();
    });
    if (logFiles.length > 0) {
        const mostRecentLogFile = logFiles[0];
        const logFilePath = path_1.default.join(LOG_DIRECTORY, mostRecentLogFile);
        const logContent = fs_1.default.readFileSync(logFilePath, 'utf-8');
        return logContent;
    }
    return 'No logs found within the last 5 minutes.';
};
exports.readLogs = readLogs;
const autoDeleteOldLogs = (duration) => {
    const currentTime = new Date().getTime();
    const logFiles = fs_1.default.readdirSync(LOG_DIRECTORY);
    logFiles.forEach((logFile) => {
        const logFilePath = path_1.default.join(LOG_DIRECTORY, logFile);
        const fileStats = fs_1.default.statSync(logFilePath);
        const fileCreationTime = fileStats.ctime.getTime();
        if (currentTime - fileCreationTime >= duration) {
            fs_1.default.unlinkSync(logFilePath);
        }
    });
};
exports.autoDeleteOldLogs = autoDeleteOldLogs;
