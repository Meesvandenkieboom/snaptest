import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { encrypt, decrypt } from '../../common/crypto.util';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountStatus } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private get encryptionKey(): string {
    const key = this.configService.get<string>('ENCRYPTION_KEY');
    if (!key) {
      throw new Error('ENCRYPTION_KEY not configured');
    }
    return key;
  }

  async findAll(userId: string, status?: AccountStatus) {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const accounts = await this.prisma.account.findMany({
      where,
      include: {
        proxy: {
          select: {
            id: true,
            host: true,
            port: true,
            protocol: true,
            country: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Decrypt passwords for response (be careful with this in production)
    return accounts.map((account) => ({
      ...account,
      password: undefined, // Don't send passwords in list view
    }));
  }

  async findOne(id: string, userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
      include: {
        proxy: true,
        jobs: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            video: {
              select: {
                id: true,
                title: true,
                originalName: true,
              },
            },
          },
        },
        postHistory: {
          take: 20,
          orderBy: { postedAt: 'desc' },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async create(userId: string, dto: CreateAccountDto) {
    // Check if username already exists
    const existing = await this.prisma.account.findUnique({
      where: { username: dto.username },
    });

    if (existing) {
      throw new ConflictException('Username already exists');
    }

    // Verify proxy exists if provided
    if (dto.proxyId) {
      const proxy = await this.prisma.proxy.findFirst({
        where: { id: dto.proxyId, isActive: true },
      });
      if (!proxy) {
        throw new BadRequestException('Proxy not found or inactive');
      }
    }

    // Encrypt password
    const encryptedPassword = encrypt(dto.password, this.encryptionKey);

    // Create account
    const account = await this.prisma.account.create({
      data: {
        userId,
        username: dto.username,
        password: encryptedPassword,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        proxyId: dto.proxyId,
        dailyPostLimit: dto.dailyPostLimit || 3,
        status: AccountStatus.PENDING,
      },
      include: {
        proxy: true,
      },
    });

    return account;
  }

  async update(id: string, userId: string, dto: UpdateAccountDto) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Verify proxy exists if provided
    if (dto.proxyId) {
      const proxy = await this.prisma.proxy.findFirst({
        where: { id: dto.proxyId, isActive: true },
      });
      if (!proxy) {
        throw new BadRequestException('Proxy not found or inactive');
      }
    }

    const updateData: any = {
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      proxyId: dto.proxyId,
      dailyPostLimit: dto.dailyPostLimit,
      isWarmedUp: dto.isWarmedUp,
    };

    // Encrypt new password if provided
    if (dto.password) {
      updateData.password = encrypt(dto.password, this.encryptionKey);
    }

    const updated = await this.prisma.account.update({
      where: { id },
      data: updateData,
      include: {
        proxy: true,
      },
    });

    return updated;
  }

  async delete(id: string, userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    await this.prisma.account.delete({
      where: { id },
    });

    return { message: 'Account deleted successfully' };
  }

  async login(id: string, userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.isBanned) {
      throw new BadRequestException('Account is banned');
    }

    // In a real implementation, this would trigger a Puppeteer login job
    // For now, we'll simulate a successful login
    await this.prisma.account.update({
      where: { id },
      data: {
        status: AccountStatus.ACTIVE,
        lastLoginAt: new Date(),
        failedAttempts: 0,
      },
    });

    return {
      success: true,
      message: 'Login initiated successfully',
      accountId: id,
    };
  }

  async startWarmup(id: string, userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.status !== AccountStatus.ACTIVE) {
      throw new BadRequestException('Account must be active to start warmup');
    }

    if (account.isWarmedUp) {
      throw new BadRequestException('Account is already warmed up');
    }

    // Update account status
    await this.prisma.account.update({
      where: { id },
      data: {
        status: AccountStatus.WARMING_UP,
      },
    });

    // In a real implementation, this would create warmup jobs
    // For now, we'll just return a success message
    return {
      success: true,
      message: 'Warmup process started',
      accountId: id,
    };
  }
}
