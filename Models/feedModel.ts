import { Table, Column, Model, PrimaryKey, DataType, AllowNull, BelongsToMany, AutoIncrement } from 'sequelize-typescript';
import User from './userModel';
import UserFeed from './userFeedModel';

@Table
class Feed extends Model<Feed> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  url!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  description!: string;

  @BelongsToMany(() => User, 'UserFeed', 'feedId', 'userId')
  users!: User[];
}

export default Feed;