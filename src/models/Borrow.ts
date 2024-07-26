import { Table, Model, DataType, CreatedAt, UpdatedAt, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Book from './Book';
import User from './User';

@Table({
  timestamps: true,
  tableName: 'borrows',
  modelName: 'Borrow',
})
class Borrow extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  declare user_id: string;

  @ForeignKey(() => Book)
  @Column({
    type: DataType.UUID,
  })
  declare book_id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_returned: boolean;

  @Column({
    type: DataType.FLOAT,
    defaultValue: 0,
  })
  declare rating: number;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Book)
  book!: Book;
}

export default Borrow;
