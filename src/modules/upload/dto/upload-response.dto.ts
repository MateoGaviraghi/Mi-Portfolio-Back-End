import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: 'URL pública de Cloudinary',
    example:
      'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'URL segura (HTTPS) de Cloudinary',
    example:
      'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
  })
  secureUrl: string;

  @ApiProperty({
    description: 'ID público del archivo en Cloudinary',
    example: 'portfolio/projects/abc123',
  })
  publicId: string;

  @ApiProperty({
    description: 'Ancho de la imagen en píxeles',
    example: 1920,
  })
  width: number;

  @ApiProperty({
    description: 'Alto de la imagen en píxeles',
    example: 1080,
  })
  height: number;

  @ApiProperty({
    description: 'Formato del archivo',
    example: 'jpg',
  })
  format: string;

  @ApiProperty({
    description: 'Tipo de recurso (image, video, raw)',
    example: 'image',
  })
  resourceType: string;

  @ApiProperty({
    description: 'Tamaño del archivo en bytes',
    example: 245678,
  })
  bytes: number;

  @ApiProperty({
    description: 'URL del thumbnail optimizado',
    example:
      'https://res.cloudinary.com/demo/image/upload/c_fill,h_150,w_150/v1234567890/sample.jpg',
  })
  thumbnail: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-10-20T10:30:00Z',
  })
  createdAt: Date;
}
