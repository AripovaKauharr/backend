import { Table, Model, Column, DataType } from 'sequelize-typescript';
export class CallCreationAttrs {
  caller_number: string;
  receiver_number: string;
  start_time: string;
  end_time: string;
  status: string;
  agent_id: string;
  category: string;
  priority: number;
}

@Table({ tableName: 'callsList' })
export class Call extends Model<Call, CallCreationAttrs> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING })
  declare status: string;

  @Column({ type: DataType.STRING })
  declare caller_number: string;

  @Column({ type: DataType.STRING })
  declare agent_id: string;

  @Column({ type: DataType.STRING })
  declare category: string;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare priority: number;

  @Column({ type: DataType.STRING })
  declare receiver_number: string;

  @Column({ type: DataType.STRING })
  declare start_time: string;

  @Column({ type: DataType.STRING })
  declare end_time: string;
}
