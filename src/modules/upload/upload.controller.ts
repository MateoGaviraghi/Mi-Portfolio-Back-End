import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { UploadService } from './upload.service';
import { UploadResponseDto } from './dto/upload-response.dto';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('project-image')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Subir imagen de proyecto',
    description: 'Sube una imagen para un proyecto a Cloudinary (solo admin)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (JPG, PNG, WebP, GIF)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imagen subida exitosamente',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Archivo inválido' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 413, description: 'Archivo demasiado grande' })
  async uploadProjectImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|gif)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.uploadService.uploadImage(file, 'projects');
  }

  @Post('project-video')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Subir video de proyecto',
    description: 'Sube un video para un proyecto a Cloudinary (solo admin)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de video (MP4, WebM, MOV)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Video subido exitosamente',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Archivo inválido' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 413, description: 'Archivo demasiado grande' })
  async uploadProjectVideo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
          new FileTypeValidator({
            fileType: /(mp4|webm|mov)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.uploadService.uploadVideo(file, 'projects');
  }

  @Delete('image/:publicId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Eliminar imagen',
    description: 'Elimina una imagen de Cloudinary (solo admin)',
  })
  @ApiResponse({ status: 200, description: 'Imagen eliminada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al eliminar' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async deleteImage(
    @Param('publicId') publicId: string,
  ): Promise<{ message: string; result: string }> {
    // Decodificar el publicId que viene por URL
    const decodedPublicId = decodeURIComponent(publicId);
    const result = await this.uploadService.deleteFile(
      decodedPublicId,
      'image',
    );
    return {
      message: 'Image deleted successfully',
      result: result.result,
    };
  }

  @Delete('video/:publicId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Eliminar video',
    description: 'Elimina un video de Cloudinary (solo admin)',
  })
  @ApiResponse({ status: 200, description: 'Video eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al eliminar' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async deleteVideo(
    @Param('publicId') publicId: string,
  ): Promise<{ message: string; result: string }> {
    // Decodificar el publicId que viene por URL
    const decodedPublicId = decodeURIComponent(publicId);
    const result = await this.uploadService.deleteFile(
      decodedPublicId,
      'video',
    );
    return {
      message: 'Video deleted successfully',
      result: result.result,
    };
  }

  // ====== NUEVOS ENDPOINTS: Subir y agregar al proyecto automáticamente ======

  @Post('project/:projectId/image')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Subir imagen y agregarla al proyecto',
    description:
      'Sube una imagen a Cloudinary y la agrega automáticamente al array de imágenes del proyecto',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (JPG, PNG, WebP, GIF)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imagen subida y agregada al proyecto exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Archivo inválido' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  async uploadAndAddImageToProject(
    @Param('projectId') projectId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|gif)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return await this.uploadService.uploadAndAddImageToProject(projectId, file);
  }

  @Post('project/:projectId/video')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Subir video y agregarlo al proyecto',
    description:
      'Sube un video a Cloudinary y lo agrega automáticamente al array de videos del proyecto',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de video (MP4, WebM, MOV)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Video subido y agregado al proyecto exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Archivo inválido' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  async uploadAndAddVideoToProject(
    @Param('projectId') projectId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
          new FileTypeValidator({
            fileType: /(mp4|webm|mov)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return await this.uploadService.uploadAndAddVideoToProject(projectId, file);
  }

  @Delete('project/:projectId/image/:publicId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Eliminar imagen del proyecto',
    description:
      'Elimina la imagen de Cloudinary y la remueve del array del proyecto',
  })
  @ApiResponse({
    status: 200,
    description: 'Imagen eliminada del proyecto exitosamente',
  })
  async deleteImageFromProject(
    @Param('projectId') projectId: string,
    @Param('publicId') publicId: string,
  ) {
    const decodedPublicId = decodeURIComponent(publicId);
    return await this.uploadService.deleteImageFromProject(
      projectId,
      decodedPublicId,
    );
  }

  @Delete('project/:projectId/video/:publicId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Eliminar video del proyecto',
    description:
      'Elimina el video de Cloudinary y lo remueve del array del proyecto',
  })
  @ApiResponse({
    status: 200,
    description: 'Video eliminado del proyecto exitosamente',
  })
  async deleteVideoFromProject(
    @Param('projectId') projectId: string,
    @Param('publicId') publicId: string,
  ) {
    const decodedPublicId = decodeURIComponent(publicId);
    return await this.uploadService.deleteVideoFromProject(
      projectId,
      decodedPublicId,
    );
  }
}
