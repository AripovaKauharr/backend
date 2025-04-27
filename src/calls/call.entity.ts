import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Call {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  callerName: string;

  @Column()
  phoneNumber: string;

  @Column()
  createdAt: Date;

  @Column()
  callDuration: number;

  @Column()
  status: string;
}
