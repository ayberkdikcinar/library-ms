import { Table, Model, DataType, CreatedAt, UpdatedAt, Column, HasMany } from 'sequelize-typescript';
import Borrow from './Borrow';

@Table({
  timestamps: true,
  tableName: 'users',
  modelName: 'User',
})
class User extends Model {
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

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @HasMany(() => Borrow)
  borrows!: Borrow[];
}

export default User;
