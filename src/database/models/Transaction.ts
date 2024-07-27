import { Table, Model, DataType, CreatedAt, UpdatedAt, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import BookEntity from './Book';
import UserEntity from './User';
import { Transaction, CreateTransactionAttributes } from '../../interfaces/Transaction';

@Table({
  timestamps: true,
  tableName: 'Transactions',
  modelName: 'Transaction',
})
class TransactionEntity extends Model<Transaction, CreateTransactionAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.UUID,
  })
  declare user_id: string;

  @ForeignKey(() => BookEntity)
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
    allowNull: true,
    defaultValue: null,
  })
  declare score: number | null;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @BelongsTo(() => UserEntity)
  user!: UserEntity;

  @BelongsTo(() => BookEntity)
  book!: BookEntity;
}

export default TransactionEntity;
