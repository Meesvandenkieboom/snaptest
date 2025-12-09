import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoStatus } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class VideosService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(private prisma: PrismaService) {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async findAll(userId: string, status?: VideoStatus) {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    return this.prisma.video.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        originalName: true,
        mimeType: true,
        fileSize: true,
        duration: true,
        title: true,
        description: true,
        tags: true,
        status: true,
        uploadedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const video = await this.prisma.video.findFirst({
      where: { id, userId },
      include: {
        jobs: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: {
            account: {
              select: {
                id: true,
                username: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return video;
  }

  async create(
    userId: string,
    file: {
      filename: string;
      originalname: string;
      mimetype: string;
      size: number;
      path: string;
    },
  ) {
    // Validate file type
    if (!file.mimetype.startsWith('video/')) {
      // Clean up uploaded file
      await fs.unlink(file.path).catch(() => {});
      throw new BadRequestException('File must be a video');
    }

    // Create video record
    const video = await this.prisma.video.create({
      data: {
        userId,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        localPath: file.path,
        status: VideoStatus.UPLOADED,
      },
    });

    return video;
  }

  async update(id: string, userId: string, dto: UpdateVideoDto) {
    const video = await this.prisma.video.findFirst({
      where: { id, userId },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    const updated = await this.prisma.video.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        tags: dto.tags,
      },
    });

    return updated;
  }

  async delete(id: string, userId: string) {
    const video = await this.prisma.video.findFirst({
      where: { id, userId },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Delete file from filesystem
    try {
      await fs.unlink(video.localPath);
    } catch (error) {
      // File might not exist, continue with deletion
      console.warn(`Failed to delete video file: ${video.localPath}`, error);
    }

    // Delete from database
    await this.prisma.video.delete({
      where: { id },
    });

    return { message: 'Video deleted successfully' };
  }
}
