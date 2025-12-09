import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProxiesService } from './proxies.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateProxyDto } from './dto/create-proxy.dto';
import { UpdateProxyDto } from './dto/update-proxy.dto';

@Controller('proxies')
@UseGuards(JwtAuthGuard)
export class ProxiesController {
  constructor(private proxiesService: ProxiesService) {}

  @Get()
  async findAll() {
    return this.proxiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.proxiesService.findOne(id);
  }

  @Post()
  async create(@Body() createProxyDto: CreateProxyDto) {
    return this.proxiesService.create(createProxyDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProxyDto: UpdateProxyDto,
  ) {
    return this.proxiesService.update(id, updateProxyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.proxiesService.delete(id);
  }

  @Post(':id/check')
  async checkHealth(@Param('id') id: string) {
    return this.proxiesService.checkHealth(id);
  }
}
