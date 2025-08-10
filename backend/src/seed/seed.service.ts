import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor, DoctorStatus, Gender } from '../entities/doctor.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async seedDoctors() {
    const existingDoctors = await this.doctorRepository.count();
    if (existingDoctors > 0) {
      console.log('Doctors already exist, skipping seed');
      return;
    }

    const doctors = [
      {
        name: 'Dr. Smith',
        specialization: 'General Practice',
        gender: Gender.MALE,
        location: 'Room 101',
        status: DoctorStatus.AVAILABLE,
        nextAvailable: null,
      },
      {
        name: 'Dr. Johnson',
        specialization: 'Pediatrics',
        gender: Gender.FEMALE,
        location: 'Room 102',
        status: DoctorStatus.BUSY,
        nextAvailable: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      },
      {
        name: 'Dr. Lee',
        specialization: 'Cardiology',
        gender: Gender.MALE,
        location: 'Room 103',
        status: DoctorStatus.OFF_DUTY,
        nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      },
      {
        name: 'Dr. Patel',
        specialization: 'Dermatology',
        gender: Gender.FEMALE,
        location: 'Room 104',
        status: DoctorStatus.AVAILABLE,
        nextAvailable: null,
      },
    ];

    for (const doctorData of doctors) {
      const doctor = this.doctorRepository.create(doctorData);
      await this.doctorRepository.save(doctor);
    }

    console.log('Sample doctors seeded successfully');
  }
}
