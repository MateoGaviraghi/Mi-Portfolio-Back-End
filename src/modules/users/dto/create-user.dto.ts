import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.VISITOR,
    description: 'Rol del usuario',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'URL del avatar del usuario',
  })
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    example: 'Full-stack developer apasionado por la tecnología',
    description: 'Biografía del usuario',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/in/username',
    description: 'Perfil de LinkedIn',
  })
  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/username',
    description: 'Perfil de GitHub',
  })
  @IsUrl()
  @IsOptional()
  github?: string;
}
