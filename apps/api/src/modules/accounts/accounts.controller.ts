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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountStatus } from '@prisma/client';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  async findAll(
    @User('userId') userId: string,
    @Query('status') status?: AccountStatus,
  ) {
    return this.accountsService.findAll(userId, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User('userId') userId: string) {
    return this.accountsService.findOne(id, userId);
  }

  @Post()
  async create(
    @User('userId') userId: string,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    return this.accountsService.create(userId, createAccountDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @User('userId') userId: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, userId, updateAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @User('userId') userId: string) {
    return this.accountsService.delete(id, userId);
  }

  @Post(':id/login')
  async login(@Param('id') id: string, @User('userId') userId: string) {
    return this.accountsService.login(id, userId);
  }

  @Post(':id/warmup')
  async startWarmup(@Param('id') id: string, @User('userId') userId: string) {
    return this.accountsService.startWarmup(id, userId);
  }
}
