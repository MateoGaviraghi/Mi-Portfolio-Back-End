import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsArray,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { SkillCategory } from '../schemas/skill.scehma';

export class CreateSkillDto {
  @ApiProperty({
    description: 'Skill name',
    example: 'React',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Skill category',
    enum: SkillCategory,
    example: SkillCategory.FRONTEND,
  })
  @IsEnum(SkillCategory)
  category: SkillCategory;

  @ApiProperty({
    description: 'Skill proficiency level (0-100)',
    minimum: 0,
    maximum: 100,
    example: 85,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  level: number;

  @ApiPropertyOptional({
    description: 'Icon URL or icon name',
    example: 'https://cdn.example.com/react-icon.svg',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Years of experience with this skill',
    minimum: 0,
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsExperience?: number;

  @ApiPropertyOptional({
    description: 'Brief description of the skill',
    maxLength: 500,
    example:
      'Building modern, responsive web applications with React and TypeScript',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Array of related project IDs',
    type: [String],
    example: ['507f1f77bcf86cd799439011'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedProjects?: string[];

  @ApiPropertyOptional({
    description: 'Whether the skill is active/visible',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
