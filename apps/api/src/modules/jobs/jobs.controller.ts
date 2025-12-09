import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus } from '@prisma/client';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  async findAll(
    @User('userId') userId: string,
    @Query('status') status?: JobStatus,
    @Query('accountId') accountId?: string,
  ) {
    return this.jobsService.findAll(userId, status, accountId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User('userId') userId: string) {
    return this.jobsService.findOne(id, userId);
  }

  @Post()
  async create(
    @User('userId') userId: string,
    @Body() createJobDto: CreateJobDto,
  ) {
    return this.jobsService.create(userId, createJobDto);
  }

  @Post(':id/retry')
  async retry(@Param('id') id: string, @User('userId') userId: string) {
    return this.jobsService.retry(id, userId);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @User('userId') userId: string) {
    return this.jobsService.cancel(id, userId);
  }

  @Get(':id/logs')
  async getLogs(@Param('id') id: string, @User('userId') userId: string) {
    return this.jobsService.getLogs(id, userId);
  }
}
