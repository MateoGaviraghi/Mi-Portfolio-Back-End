import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsBoolean,
  IsObject,
  MaxLength,
  MinLength,
} from 'class-validator';
import { InsightType, AITool } from '../schemas/ai-insight.schema';

export class CreateAiInsightDto {
  @ApiPropertyOptional({
    description: 'Project ID this insight belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({
    description: 'Insight title',
    example: 'AI-Powered User Authentication System',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Detailed description of the AI insight',
    example:
      'Used GitHub Copilot to generate the complete JWT authentication flow, saving 4 hours of development time.',
    maxLength: 2000,
  })
  @IsString()
  @MaxLength(2000)
  description: string;

  @ApiProperty({
    description: 'Type of AI insight',
    enum: InsightType,
    example: InsightType.CODE_GENERATION,
  })
  @IsEnum(InsightType)
  type: InsightType;

  @ApiProperty({
    description: 'AI tools used',
    enum: AITool,
    isArray: true,
    example: [AITool.GITHUB_COPILOT, AITool.CHATGPT],
  })
  @IsArray()
  @IsEnum(AITool, { each: true })
  aiTools: AITool[];

  @ApiPropertyOptional({
    description: 'Impact percentage of AI in this task (0-100)',
    minimum: 0,
    maximum: 100,
    example: 75,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  impactPercentage?: number;

  @ApiPropertyOptional({
    description: 'Code snippet generated or improved by AI',
    example: 'const token = jwt.sign({ userId }, SECRET_KEY);',
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  codeSnippet?: string;

  @ApiPropertyOptional({
    description: 'Code before AI assistance',
    example: '// Manual implementation...',
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  beforeCode?: string;

  @ApiPropertyOptional({
    description: 'Code after AI assistance',
    example: '// Optimized with AI...',
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  afterCode?: string;

  @ApiPropertyOptional({
    description: 'Time saved in minutes',
    example: 240,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  timeSaved?: number;

  @ApiPropertyOptional({
    description: 'Tags for categorization',
    type: [String],
    example: ['authentication', 'jwt', 'security'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Whether this insight is public',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: 'Metrics about the code',
    example: { linesOfCode: 150, complexity: 'low', performance: 'high' },
  })
  @IsOptional()
  @IsObject()
  metrics?: {
    linesOfCode?: number;
    complexity?: number;
    performance?: string;
  };
}
