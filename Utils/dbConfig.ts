// Imports
import { Sequelize } from 'sequelize-typescript';
import env from 'dotenv';
import User from '../Models/userModel';
import Feed from '../Models/feedModel';
import UserFeed from '../Models/userFeedModel';

// Config
env.config();

// DB connectivity
const sequelize = new Sequelize({
  database: process.env.DATABASE,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  dialect: 'mysql',
  models: [User,Feed,UserFeed],
});

sequelize.sync().then(() => {
  console.log('Database synced successfully.');
});

export default sequelize;