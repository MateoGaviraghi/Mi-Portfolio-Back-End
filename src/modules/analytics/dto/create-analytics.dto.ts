import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsOptional,
  IsObject,
  IsNumber,
} from 'class-validator';
import { EventType } from '../schemas/analytics.schema';

export class CreateAnalyticsDto {
  @ApiProperty({
    description: 'Type of event being tracked',
    enum: EventType,
    example: EventType.PAGE_VIEW,
  })
  @IsEnum(EventType)
  eventType: EventType;

  @ApiPropertyOptional({
    description: 'Page path',
    example: '/projects/my-awesome-project',
  })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Referrer URL',
    example: 'https://google.com',
  })
  @IsOptional()
  @IsString()
  referrer?: string;

  @ApiPropertyOptional({
    description: 'User agent string',
    example: 'Mozilla/5.0...',
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({
    description: 'User IP address',
    example: '192.168.1.1',
  })
  @IsOptional()
  @IsString()
  ip?: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'Argentina',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'Buenos Aires',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Device type',
    example: 'desktop',
  })
  @IsOptional()
  @IsString()
  device?: string;

  @ApiPropertyOptional({
    description: 'Browser name',
    example: 'chrome',
  })
  @IsOptional()
  @IsString()
  browser?: string;

  @ApiPropertyOptional({
    description: 'Operating system',
    example: 'windows',
  })
  @IsOptional()
  @IsString()
  os?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { projectId: '123', action: 'download' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Session ID',
    example: 'sess_1234567890',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({
    description: 'Duration in seconds',
    example: 45,
  })
  @IsOptional()
  @IsNumber()
  duration?: number;
}
