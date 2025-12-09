import { IsString, IsArray, IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';

export class CreateJobDto {
  @IsArray()
  @IsString({ each: true })
  accountIds: string[];

  @IsString()
  videoId: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  priority?: number;

  @IsDateString()
  @IsOptional()
  scheduledFor?: string;
}
