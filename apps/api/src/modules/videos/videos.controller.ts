import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoStatus } from '@prisma/client';

@Controller('videos')
@UseGuards(JwtAuthGuard)
export class VideosController {
  constructor(private videosService: VideosService) {}

  @Get()
  async findAll(
    @User('userId') userId: string,
    @Query('status') status?: VideoStatus,
  ) {
    return this.videosService.findAll(userId, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User('userId') userId: string) {
    return this.videosService.findOne(id, userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('video'))
  async upload(
    @User('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Video file is required');
    }

    return this.videosService.create(userId, {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @User('userId') userId: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return this.videosService.update(id, userId, updateVideoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @User('userId') userId: string) {
    return this.videosService.delete(id, userId);
  }
}
