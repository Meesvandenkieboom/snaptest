import { IsString, IsInt, IsOptional, IsEnum, IsBoolean, Min, Max } from 'class-validator';
import { ProxyType } from '@prisma/client';

export class UpdateProxyDto {
  @IsString()
  @IsOptional()
  host?: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  port?: number;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(ProxyType)
  @IsOptional()
  protocol?: ProxyType;

  @IsString()
  @IsOptional()
  country?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
