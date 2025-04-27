import { Table, Model, Column, DataType } from 'sequelize-typescript';
export class CallCreationAttrs {
  caller_number: string;
  receiver_number: string;
  priority: number;
  category: number;
}

@Table({ tableName: 'callsList' })
export class Call extends Model<Call, CallCreationAttrs> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  status: number;

  @Column({ type: DataType.STRING })
  caller_number: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  agent_id: number;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  category: number;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  priority: number;

  @Column({ type: DataType.STRING })
  receiver_number: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  start_time: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  end_time: string;
}
