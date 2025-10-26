import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectCategory } from '../schemas/project.schema';

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

  @ApiPropertyOptional({
    example:
      'Plataforma completa de e-commerce desarrollada con las últimas tecnologías...',
    description:
      'Descripción detallada del proyecto (opcional, sin límite de caracteres)',
  })
  @IsString()
  @IsOptional()
  longDescription?: string;

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
    example: 'https://github.com/usuario/proyecto',
    description: 'URL del repositorio (opcional, string vacío si no aplica)',
  })
  @IsString()
  @IsOptional()
  githubUrl?: string;

  @ApiPropertyOptional({
    example: 'https://proyecto-demo.vercel.app',
    description:
      'URL del proyecto en vivo (opcional, string vacío si no aplica)',
  })
  @IsString()
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
}
