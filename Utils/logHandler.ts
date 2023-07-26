import fs from 'fs';
import path from 'path';

const LOG_DIRECTORY = path.join(__dirname, '../logs');
const logOperation = (userId: string, userRole: string, operation: string, message: string) => {
  const logData = `[${new Date().toISOString()}] User ID: ${userId}, Role: ${userRole}, Operation: ${operation}, Message: ${message}\n`;
  const logFileName = `ApiLogDetails.log`;
  const logFilePath = path.join(LOG_DIRECTORY, logFileName);
  fs.appendFile(logFilePath, logData, (err) => {
    if (err) {
      console.error('Error writing log:', err);
    }
  });
};

const readLogs = () => {
   const currentTime = new Date().getTime();
   const logFiles = fs.readdirSync(LOG_DIRECTORY).filter((logFile) => {
     const logFilePath = path.join(LOG_DIRECTORY, logFile);
     const fileStats = fs.statSync(logFilePath);
     const fileCreationTime = fileStats.ctime.getTime();
     return currentTime - fileCreationTime <= 5 * 60 * 1000;
   }).sort((a, b) => {
     const statA = fs.statSync(path.join(LOG_DIRECTORY, a));
     const statB = fs.statSync(path.join(LOG_DIRECTORY, b));
     return statB.mtime.getTime() - statA.mtime.getTime();
   });
   if (logFiles.length > 0) {
     const mostRecentLogFile = logFiles[0];
     const logFilePath = path.join(LOG_DIRECTORY, mostRecentLogFile);
     const logContent = fs.readFileSync(logFilePath, 'utf-8');
     return logContent;
   }
   return 'No logs found within the last 5 minutes.';
};

const autoDeleteOldLogs = (duration: number) => {
  const currentTime = new Date().getTime();
  const logFiles = fs.readdirSync(LOG_DIRECTORY);

  logFiles.forEach((logFile) => {
    const logFilePath = path.join(LOG_DIRECTORY, logFile);
    const fileStats = fs.statSync(logFilePath);
    const fileCreationTime = fileStats.ctime.getTime();

    if (currentTime - fileCreationTime >= duration) {
      fs.unlinkSync(logFilePath);
    }
  });
};

export { logOperation, readLogs, autoDeleteOldLogs };