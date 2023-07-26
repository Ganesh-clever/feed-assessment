// models/User.ts
import { Table, Column, Model, PrimaryKey, DataType, AllowNull, BelongsToMany, AutoIncrement } from 'sequelize-typescript';
import Feed from './feedModel';

@Table
class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  role!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @BelongsToMany(() => Feed, 'UserFeed', 'userId', 'feedId')
  feeds!: Feed[] | any;

  hasAccessToFeed(feedId: string): boolean {
    return !!this.feeds.find((feed:any) => feed.id === feedId);
  }
}

export default User;