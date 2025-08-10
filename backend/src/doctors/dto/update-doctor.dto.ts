import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { Gender, DoctorStatus } from '../../entities/doctor.entity';

export class UpdateDoctorDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  specialization?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsNotEmpty()
  location?: string;

  @IsOptional()
  @IsEnum(DoctorStatus)
  status?: DoctorStatus;
}
