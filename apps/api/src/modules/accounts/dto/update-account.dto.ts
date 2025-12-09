import { IsString, IsOptional, IsEmail, IsInt, Min, Max, IsBoolean } from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  password?: string;

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

  @IsBoolean()
  @IsOptional()
  isWarmedUp?: boolean;
}
