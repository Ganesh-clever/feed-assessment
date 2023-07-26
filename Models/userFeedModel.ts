import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import User from './userModel';
import Feed from './feedModel';

@Table
class UserFeed extends Model<UserFeed> {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @ForeignKey(() => Feed)
  @Column(DataType.INTEGER)
  feedId!: number;

  @Column(DataType.STRING)
  accessType!: 'read' | 'write' | 'delete';

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Feed)
  feed!: Feed;
}

export default UserFeed;
