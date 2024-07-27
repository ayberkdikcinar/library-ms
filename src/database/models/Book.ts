import { Table, Model, DataType, CreatedAt, UpdatedAt, Column, HasMany } from 'sequelize-typescript';
import TransactionEntity from './Transaction';
import { Book, CreateBookAttributes } from '../../interfaces/Book';

@Table({
  timestamps: true,
  tableName: 'books',
  modelName: 'Book',
})
class BookEntity extends Model<Book, CreateBookAttributes> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    type: DataType.FLOAT,
  })
  declare average_rating: number;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @HasMany(() => TransactionEntity)
  transactions!: TransactionEntity[];
}

export default BookEntity;
