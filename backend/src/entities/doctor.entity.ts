import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export enum DoctorStatus {
  AVAILABLE = 'Available',
  BUSY = 'Busy',
  OFF_DUTY = 'Off Duty',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  specialization: string;

  @Column({
    type: 'varchar',
  })
  gender: Gender;

  @Column()
  @IsNotEmpty()
  location: string;

  @Column({
    type: 'varchar',
    default: DoctorStatus.AVAILABLE,
  })
  status: DoctorStatus;

  @Column({ type: 'datetime', nullable: true })
  nextAvailable: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
