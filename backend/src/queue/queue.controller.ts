import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueueStatus, Priority } from '../entities/patient-queue.entity';

@Controller('queue')
// @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get()
  findAll() {
    return this.queueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queueService.findOne(+id);
  }

  @Post()
  create(@Body() createQueueDto: CreateQueueDto) {
    return this.queueService.create(createQueueDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateQueueDto: UpdateQueueDto) {
    return this.queueService.update(+id, updateQueueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queueService.remove(+id);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: QueueStatus }) {
    return this.queueService.updateStatus(+id, body.status);
  }

  @Put(':id/priority')
  updatePriority(@Param('id') id: string, @Body() body: { priority: Priority }) {
    return this.queueService.updatePriority(+id, body.priority);
  }

  @Get(':id/position')
  getQueuePosition(@Param('id') id: string) {
    return this.queueService.getQueuePosition(+id);
  }
}
