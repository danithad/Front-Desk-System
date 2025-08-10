import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientQueue, QueueStatus, Priority } from '../entities/patient-queue.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(PatientQueue)
    private queueRepository: Repository<PatientQueue>,
  ) {}

  async findAll(): Promise<PatientQueue[]> {
    return this.queueRepository.find({
      order: {
        priority: 'DESC', // Urgent first
        arrivalTime: 'ASC', // Then by arrival time
      },
    });
  }

  async findOne(id: number): Promise<PatientQueue> {
    const patient = await this.queueRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async create(createQueueDto: CreateQueueDto): Promise<PatientQueue> {
    // Get the next queue number
    const lastPatient = await this.queueRepository.findOne({
      where: {},
      order: { queueNumber: 'DESC' },
    });
    const nextQueueNumber = lastPatient ? lastPatient.queueNumber + 1 : 1;

    const patient = this.queueRepository.create({
      ...createQueueDto,
      queueNumber: nextQueueNumber,
      arrivalTime: new Date(),
    });

    return this.queueRepository.save(patient);
  }

  async update(id: number, updateQueueDto: UpdateQueueDto): Promise<PatientQueue> {
    const patient = await this.findOne(id);
    Object.assign(patient, updateQueueDto);
    return this.queueRepository.save(patient);
  }

  async remove(id: number): Promise<void> {
    const patient = await this.findOne(id);
    await this.queueRepository.remove(patient);
  }

  async updateStatus(id: number, status: QueueStatus): Promise<PatientQueue> {
    const patient = await this.findOne(id);
    patient.status = status;
    return this.queueRepository.save(patient);
  }

  async updatePriority(id: number, priority: Priority): Promise<PatientQueue> {
    const patient = await this.findOne(id);
    patient.priority = priority;
    return this.queueRepository.save(patient);
  }

  async getQueuePosition(id: number): Promise<number> {
    const patient = await this.findOne(id);
    const allPatients = await this.findAll();
    const urgentPatients = allPatients.filter(p => p.priority === Priority.URGENT);
    const normalPatients = allPatients.filter(p => p.priority === Priority.NORMAL);

    if (patient.priority === Priority.URGENT) {
      return urgentPatients.findIndex(p => p.id === id) + 1;
    } else {
      return urgentPatients.length + normalPatients.findIndex(p => p.id === id) + 1;
    }
  }
}
