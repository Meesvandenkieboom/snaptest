import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { encrypt, decrypt } from '../../common/crypto.util';
import { CreateProxyDto } from './dto/create-proxy.dto';
import { UpdateProxyDto } from './dto/update-proxy.dto';
import { ProxyType } from '@prisma/client';

@Injectable()
export class ProxiesService {
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

  async findAll() {
    const proxies = await this.prisma.proxy.findMany({
      include: {
        _count: {
          select: { accounts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Don't send passwords in list view
    return proxies.map((proxy) => ({
      ...proxy,
      password: undefined,
    }));
  }

  async findOne(id: string) {
    const proxy = await this.prisma.proxy.findUnique({
      where: { id },
      include: {
        accounts: {
          select: {
            id: true,
            username: true,
            status: true,
          },
        },
      },
    });

    if (!proxy) {
      throw new NotFoundException('Proxy not found');
    }

    return proxy;
  }

  async create(dto: CreateProxyDto) {
    // Check if proxy already exists
    const existing = await this.prisma.proxy.findUnique({
      where: {
        host_port: {
          host: dto.host,
          port: dto.port,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Proxy with this host and port already exists');
    }

    // Encrypt password if provided
    const encryptedPassword = dto.password
      ? encrypt(dto.password, this.encryptionKey)
      : null;

    const proxy = await this.prisma.proxy.create({
      data: {
        host: dto.host,
        port: dto.port,
        username: dto.username,
        password: encryptedPassword,
        protocol: dto.protocol || ProxyType.HTTP,
        country: dto.country,
      },
    });

    return proxy;
  }

  async update(id: string, dto: UpdateProxyDto) {
    const proxy = await this.prisma.proxy.findUnique({
      where: { id },
    });

    if (!proxy) {
      throw new NotFoundException('Proxy not found');
    }

    // If updating host/port, check for conflicts
    if (dto.host || dto.port) {
      const host = dto.host || proxy.host;
      const port = dto.port || proxy.port;

      const existing = await this.prisma.proxy.findFirst({
        where: {
          AND: [
            { host },
            { port },
            { NOT: { id } },
          ],
        },
      });

      if (existing) {
        throw new ConflictException('Proxy with this host and port already exists');
      }
    }

    const updateData: any = {
      host: dto.host,
      port: dto.port,
      username: dto.username,
      protocol: dto.protocol,
      country: dto.country,
      isActive: dto.isActive,
    };

    // Encrypt new password if provided
    if (dto.password) {
      updateData.password = encrypt(dto.password, this.encryptionKey);
    }

    const updated = await this.prisma.proxy.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  async delete(id: string) {
    const proxy = await this.prisma.proxy.findUnique({
      where: { id },
      include: {
        _count: {
          select: { accounts: true },
        },
      },
    });

    if (!proxy) {
      throw new NotFoundException('Proxy not found');
    }

    if (proxy._count.accounts > 0) {
      throw new BadRequestException(
        `Cannot delete proxy that is assigned to ${proxy._count.accounts} account(s)`,
      );
    }

    await this.prisma.proxy.delete({
      where: { id },
    });

    return { message: 'Proxy deleted successfully' };
  }

  async checkHealth(id: string) {
    const proxy = await this.prisma.proxy.findUnique({
      where: { id },
    });

    if (!proxy) {
      throw new NotFoundException('Proxy not found');
    }

    // In a real implementation, this would actually test the proxy connection
    // For now, we'll simulate a health check
    const isHealthy = Math.random() > 0.2; // 80% success rate for demo

    // Update proxy status
    await this.prisma.proxy.update({
      where: { id },
      data: {
        lastChecked: new Date(),
        failCount: isHealthy ? 0 : proxy.failCount + 1,
        isActive: isHealthy && proxy.failCount < 5,
      },
    });

    return {
      proxyId: id,
      healthy: isHealthy,
      checkedAt: new Date(),
      message: isHealthy
        ? 'Proxy is operational'
        : 'Proxy connection failed',
    };
  }
}
