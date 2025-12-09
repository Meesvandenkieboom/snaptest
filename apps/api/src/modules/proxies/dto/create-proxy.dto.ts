import { IsString, IsInt, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { ProxyType } from '@prisma/client';

export class CreateProxyDto {
  @IsString()
  host: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  port: number;

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
}
