import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './doctors/doctors.module';
import { QueueModule } from './queue/queue.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { User } from './entities/user.entity';
import { Doctor } from './entities/doctor.entity';
import { PatientQueue } from './entities/patient-queue.entity';
import { Appointment } from './entities/appointment.entity';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
              TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'database.sqlite',
            entities: [User, Doctor, PatientQueue, Appointment],
            synchronize: true, // Only for development
          }),
    TypeOrmModule.forFeature([Doctor]),
    AuthModule,
    DoctorsModule,
    QueueModule,
    AppointmentsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
