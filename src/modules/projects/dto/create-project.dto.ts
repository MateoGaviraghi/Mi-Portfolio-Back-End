import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsUrl,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProjectCategory } from '../schemas/project.schema';

class AiGeneratedDto {
  @ApiProperty({
    example: 45,
    description: 'Porcentaje de código generado con IA (0-100)',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiProperty({
    example: ['GitHub Copilot', 'ChatGPT', 'Claude'],
    description: 'Herramientas de IA utilizadas',
  })
  @IsArray()
  @IsString({ each: true })
  tools: string[];

  @ApiProperty({
    example: 'Se utilizó IA para generar componentes base y lógica de negocio',
    description: 'Descripción de cómo se utilizó IA',
  })
  @IsString()
  description: string;
}

export class CreateProjectDto {
  @ApiProperty({
    example: 'E-commerce Platform',
    description: 'Título del proyecto',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Plataforma de e-commerce completa con carrito de compras',
    description: 'Descripción breve del proyecto',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example:
      'Plataforma completa de e-commerce desarrollada con las últimas tecnologías...',
    description: 'Descripción detallada del proyecto',
  })
  @IsString()
  @IsNotEmpty()
  longDescription: string;

  @ApiProperty({
    example: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    description: 'Tecnologías utilizadas en el proyecto',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  technologies: string[];

  @ApiPropertyOptional({
    example: [
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      'https://res.cloudinary.com/demo/image/upload/sample2.jpg',
    ],
    description: 'URLs de imágenes del proyecto (Cloudinary)',
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({
    example: ['https://res.cloudinary.com/demo/video/upload/demo.mp4'],
    description: 'URLs de videos del proyecto (Cloudinary)',
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  videos?: string[];

  @ApiPropertyOptional({
    example: 'https://github.com/username/project',
    description: 'URL del repositorio en GitHub',
  })
  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @ApiPropertyOptional({
    example: 'https://project-demo.vercel.app',
    description: 'URL del proyecto en vivo',
  })
  @IsUrl()
  @IsOptional()
  liveUrl?: string;

  @ApiProperty({
    enum: ProjectCategory,
    example: ProjectCategory.WEB,
    description: 'Categoría del proyecto',
  })
  @IsEnum(ProjectCategory)
  @IsNotEmpty()
  category: ProjectCategory;

  @ApiPropertyOptional({
    example: true,
    description: 'Si el proyecto está destacado en el portfolio',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiProperty({
    description: 'Información sobre el uso de IA en el proyecto',
    type: AiGeneratedDto,
  })
  @ValidateNested()
  @Type(() => AiGeneratedDto)
  aiGenerated: AiGeneratedDto;
}
