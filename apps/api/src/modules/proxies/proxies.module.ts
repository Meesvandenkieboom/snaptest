import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ProxiesController } from './proxies.controller';
import { ProxiesService } from './proxies.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    }),
  ],
  controllers: [ProxiesController],
  providers: [ProxiesService],
  exports: [ProxiesService],
})
export class ProxiesModule {}
