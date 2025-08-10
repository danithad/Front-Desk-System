import { IsNotEmpty, IsEnum } from 'class-validator';
import { Gender, DoctorStatus } from '../../entities/doctor.entity';

export class CreateDoctorDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  specialization: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  location: string;

  @IsEnum(DoctorStatus)
  status: DoctorStatus;
}
