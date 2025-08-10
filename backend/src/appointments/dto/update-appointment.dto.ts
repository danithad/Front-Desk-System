import { IsOptional, IsNotEmpty, IsNumber, IsDateString, IsString } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsNotEmpty()
  patientName?: string;

  @IsOptional()
  @IsNumber()
  doctorId?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  time?: string;
}
