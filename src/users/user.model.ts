import { ApiProperty } from '@nestjs/swagger';
import { Model, Column, DataType, Table } from 'sequelize-typescript';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 'exemple@gmail.com', description: 'email' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @ApiProperty({ example: 'password', description: 'password' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ApiProperty({ example: 'Ktoto Ivan', description: 'userName' })
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  userName: string;
  @Column({
    type: DataType.STRING,
    defaultValue: 'USER',
  })
  role: string;
}
