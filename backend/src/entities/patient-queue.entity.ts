import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export enum QueueStatus {
  WAITING = 'Waiting',
  WITH_DOCTOR = 'With Doctor',
  COMPLETED = 'Completed',
}

export enum Priority {
  NORMAL = 'Normal',
  URGENT = 'Urgent',
}

@Entity()
export class PatientQueue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  patientName: string;

  @Column({ type: 'datetime' })
  arrivalTime: Date;

  @Column({ type: 'int', default: 0 })
  estWaitTime: number; // in minutes

  @Column({
    type: 'varchar',
    default: QueueStatus.WAITING,
  })
  status: QueueStatus;

  @Column({
    type: 'varchar',
    default: Priority.NORMAL,
  })
  priority: Priority;

  @Column({ type: 'int' })
  queueNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
