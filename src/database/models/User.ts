import { Table, Model, DataType, CreatedAt, UpdatedAt, Column, HasMany } from 'sequelize-typescript';
import { User, CreateUserAttributes } from '../../interfaces/User';
import TransactionEntity from './Transaction';

@Table({
  timestamps: true,
  tableName: 'users',
  modelName: 'User',
})
class UserEntity extends Model<User, CreateUserAttributes> {
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

  @HasMany(() => TransactionEntity)
  transactions!: TransactionEntity[];
}

export default UserEntity;
