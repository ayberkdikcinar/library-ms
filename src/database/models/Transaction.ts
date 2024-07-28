import {
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  Column,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import BookEntity from './Book';
import UserEntity from './User';
import { Transaction, CreateTransactionAttributes } from '../../interfaces/Transaction';

@Table({
  timestamps: true,
  tableName: 'transactions',
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
  @Index('trans_user_id_index')
  @Column({
    type: DataType.UUID,
  })
  declare user_id: string;

  @ForeignKey(() => BookEntity)
  @Index('trans_book_id_index')
  @Column({
    type: DataType.UUID,
  })
  declare book_id: string;

  @Index('is_returned_index')
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
