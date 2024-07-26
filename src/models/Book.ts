import { Table, Model, DataType, CreatedAt, UpdatedAt, Column, HasMany } from 'sequelize-typescript';
import Borrow from './Borrow';

@Table({
  timestamps: true,
  tableName: 'books',
  modelName: 'Book',
})
class Book extends Model {
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
    type: DataType.SMALLINT,
  })
  declare average_rating: number;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @HasMany(() => Borrow)
  borrows!: Borrow[];
}

export default Book;
