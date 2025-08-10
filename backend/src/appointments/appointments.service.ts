import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { Doctor } from '../entities/doctor.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async findAll(date?: string): Promise<Appointment[]> {
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .orderBy('appointment.date', 'ASC')
      .addOrderBy('appointment.time', 'ASC');

    if (date) {
      query.where('appointment.date = :date', { date: new Date(date) });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Check if doctor exists
    const doctor = await this.doctorRepository.findOne({
      where: { id: createAppointmentDto.doctorId },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${createAppointmentDto.doctorId} not found`);
    }

    // Check for conflicting appointments
    const conflictingAppointment = await this.appointmentRepository.findOne({
      where: {
        doctorId: createAppointmentDto.doctorId,
        date: new Date(createAppointmentDto.date),
        time: createAppointmentDto.time,
        status: AppointmentStatus.BOOKED,
      },
    });

    if (conflictingAppointment) {
      throw new BadRequestException('This time slot is already booked');
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      date: new Date(createAppointmentDto.date),
    });
    return this.appointmentRepository.save(appointment);
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, updateAppointmentDto);
    return this.appointmentRepository.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }

  async updateStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = status;
    return this.appointmentRepository.save(appointment);
  }

  async getAvailableSlots(doctorId: number, date: string): Promise<string[]> {
    const doctor = await this.doctorRepository.findOne({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    // Get all booked slots for the doctor on the given date
    const bookedAppointments = await this.appointmentRepository.find({
      where: {
        doctorId,
        date: new Date(date),
        status: AppointmentStatus.BOOKED,
      },
    });

    const bookedTimes = bookedAppointments.map(apt => apt.time);

    // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
    const availableSlots = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (!bookedTimes.includes(time)) {
          availableSlots.push(time);
        }
      }
    }

    return availableSlots;
  }
}
