import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus, AccountStatus } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, status?: JobStatus, accountId?: string) {
    // Build where clause
    const where: any = {
      account: { userId },
    };

    if (status) {
      where.status = status;
    }

    if (accountId) {
      where.accountId = accountId;
    }

    const jobs = await this.prisma.job.findMany({
      where,
      include: {
        account: {
          select: {
            id: true,
            username: true,
            status: true,
          },
        },
        video: {
          select: {
            id: true,
            title: true,
            originalName: true,
            duration: true,
          },
        },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return jobs;
  }

  async findOne(id: string, userId: string) {
    const job = await this.prisma.job.findFirst({
      where: {
        id,
        account: { userId },
      },
      include: {
        account: {
          select: {
            id: true,
            username: true,
            email: true,
            status: true,
            proxy: {
              select: {
                id: true,
                host: true,
                port: true,
                protocol: true,
              },
            },
          },
        },
        video: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async create(userId: string, dto: CreateJobDto) {
    // Verify video exists and belongs to user
    const video = await this.prisma.video.findFirst({
      where: { id: dto.videoId, userId },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Verify all accounts exist and belong to user
    const accounts = await this.prisma.account.findMany({
      where: {
        id: { in: dto.accountIds },
        userId,
      },
    });

    if (accounts.length !== dto.accountIds.length) {
      throw new BadRequestException(
        'One or more accounts not found or do not belong to you',
      );
    }

    // Check if accounts are in valid state
    const inactiveAccounts = accounts.filter(
      (acc) =>
        acc.status === AccountStatus.BANNED ||
        acc.status === AccountStatus.SUSPENDED ||
        acc.isBanned,
    );

    if (inactiveAccounts.length > 0) {
      throw new BadRequestException(
        `Cannot create jobs for banned or suspended accounts: ${inactiveAccounts.map((a) => a.username).join(', ')}`,
      );
    }

    // Create jobs for each account
    const jobs = await Promise.all(
      dto.accountIds.map((accountId) =>
        this.prisma.job.create({
          data: {
            accountId,
            videoId: dto.videoId,
            priority: dto.priority ?? 0,
            scheduledFor: dto.scheduledFor
              ? new Date(dto.scheduledFor)
              : undefined,
            status: JobStatus.PENDING,
          },
          include: {
            account: {
              select: {
                id: true,
                username: true,
                status: true,
              },
            },
            video: {
              select: {
                id: true,
                title: true,
                originalName: true,
              },
            },
          },
        }),
      ),
    );

    return {
      created: jobs.length,
      jobs,
    };
  }

  async retry(id: string, userId: string) {
    const job = await this.prisma.job.findFirst({
      where: {
        id,
        account: { userId },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== JobStatus.FAILED) {
      throw new BadRequestException('Only failed jobs can be retried');
    }

    if (job.attemptCount >= job.maxAttempts) {
      throw new BadRequestException('Job has exceeded maximum retry attempts');
    }

    const updated = await this.prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.RETRY,
        error: null,
        errorStack: null,
      },
      include: {
        account: {
          select: {
            id: true,
            username: true,
            status: true,
          },
        },
        video: {
          select: {
            id: true,
            title: true,
            originalName: true,
          },
        },
      },
    });

    return updated;
  }

  async cancel(id: string, userId: string) {
    const job = await this.prisma.job.findFirst({
      where: {
        id,
        account: { userId },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (
      job.status === JobStatus.COMPLETED ||
      job.status === JobStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot cancel job with status: ${job.status}`,
      );
    }

    const updated = await this.prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.CANCELLED,
      },
    });

    return updated;
  }

  async getLogs(id: string, userId: string) {
    const job = await this.prisma.job.findFirst({
      where: {
        id,
        account: { userId },
      },
      select: {
        id: true,
        status: true,
        logs: true,
        screenshots: true,
        error: true,
        errorStack: true,
        startedAt: true,
        completedAt: true,
        failedAt: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }
}
