import { IsNotEmpty, IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { QueueStatus, Priority } from '../../entities/patient-queue.entity';

export class CreateQueueDto {
  @IsNotEmpty()
  patientName: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estWaitTime?: number;

  @IsOptional()
  @IsEnum(QueueStatus)
  status?: QueueStatus;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;
}
