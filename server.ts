// Imports 
import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import env from 'dotenv';
import sequelize from './Utils/dbConfig';
const app: Application = express();

// Configs
env.config();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Log Remover every 30 min
const cleanupInterval = 30 * 60 * 1000;
setInterval(() => {
  autoDeleteOldLogs(cleanupInterval);
}, cleanupInterval);

// Apis 
import userRouter from './Routers/userRouter';
import feedRouter from './Routers/feedRouter';
import { autoDeleteOldLogs } from './Utils/logHandler';

app.use('/api', userRouter);
app.use('/api', feedRouter);

// Listsen server 
app.listen(process.env.PORT, () => {
    console.log(`Server is running with port : ${process.env.PORT}`);
    sequelize.authenticate().then(() => {
        console.log('DB connected successfully.');
    }).catch((err) => {
        console.log('Error with connect.');
    })
});


