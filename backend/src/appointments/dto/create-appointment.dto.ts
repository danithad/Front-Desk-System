import { IsNotEmpty, IsNumber, IsDateString, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  patientName: string;

  @IsNumber()
  doctorId: number;

  @IsDateString()
  date: string;

  @IsString()
  time: string;
}
