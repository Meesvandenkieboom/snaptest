import { IsString, IsOptional, IsEmail, IsInt, Min, Max } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  proxyId?: string;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  dailyPostLimit?: number;
}
