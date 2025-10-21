import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { UploadResponseDto } from './dto/upload-response.dto';
import { Project, ProjectDocument } from '../projects/schemas/project.schema';
import streamifier from 'streamifier';

@Injectable()
export class UploadService {
  private readonly folder: string;

  constructor(
    private configService: ConfigService,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {
    // Configurar Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('cloudinary.cloudName'),
      api_key: this.configService.get<string>('cloudinary.apiKey'),
      api_secret: this.configService.get<string>('cloudinary.apiSecret'),
    });

    this.folder =
      this.configService.get<string>('cloudinary.folder') || 'portfolio';
  }

  /**
   * Sube una imagen a Cloudinary
   */
  async uploadImage(
    file: Express.Multer.File,
    subfolder: string = 'projects',
  ): Promise<UploadResponseDto> {
    return this.uploadFile(file, subfolder, 'image');
  }

  /**
   * Sube un video a Cloudinary
   */
  async uploadVideo(
    file: Express.Multer.File,
    subfolder: string = 'projects',
  ): Promise<UploadResponseDto> {
    return this.uploadFile(file, subfolder, 'video');
  }

  /**
   * Método genérico para subir archivos
   */
  private async uploadFile(
    file: Express.Multer.File,
    subfolder: string,
    resourceType: 'image' | 'video' | 'auto',
  ): Promise<UploadResponseDto> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `${this.folder}/${subfolder}`,
          resource_type: resourceType,
          // Transformaciones automáticas para imágenes
          ...(resourceType === 'image' && {
            transformation: [
              {
                quality: 'auto:good',
                fetch_format: 'auto',
              },
            ],
          }),
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(
              new BadRequestException(
                `Error uploading file to Cloudinary: ${error.message}`,
              ),
            );
          }

          if (!result) {
            reject(new BadRequestException('Upload failed - no result'));
            return;
          }

          resolve(this.transformToDto(result));
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Elimina un archivo de Cloudinary
   */
  async deleteFile(
    publicId: string,
    resourceType: 'image' | 'video' = 'image',
  ): Promise<{ result: string }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    } catch (error) {
      throw new BadRequestException(
        `Error deleting file from Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Elimina múltiples archivos
   */
  async deleteFiles(
    publicIds: string[],
    resourceType: 'image' | 'video' = 'image',
  ): Promise<void> {
    const deletePromises = publicIds.map((publicId) =>
      this.deleteFile(publicId, resourceType),
    );
    await Promise.all(deletePromises);
  }

  /**
   * Transforma la respuesta de Cloudinary a nuestro DTO
   */
  private transformToDto(result: UploadApiResponse): UploadResponseDto {
    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resourceType: result.resource_type,
      bytes: result.bytes,
      thumbnail: this.generateThumbnailUrl(result.public_id, result.format),
      createdAt: new Date(result.created_at),
    };
  }

  /**
   * Genera URL de thumbnail optimizado
   */
  private generateThumbnailUrl(publicId: string, format: string): string {
    return cloudinary.url(publicId, {
      transformation: [
        {
          width: 150,
          height: 150,
          crop: 'fill',
          gravity: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        },
      ],
      format,
    });
  }

  /**
   * Genera URL optimizada para diferentes tamaños
   */
  getOptimizedUrl(publicId: string, width?: number, height?: number): string {
    return cloudinary.url(publicId, {
      transformation: [
        {
          ...(width && { width }),
          ...(height && { height }),
          crop: 'limit',
          quality: 'auto:good',
          fetch_format: 'auto',
        },
      ],
    });
  }

  // ====== MÉTODOS PARA SUBIR Y AGREGAR AL PROYECTO AUTOMÁTICAMENTE ======

  /**
   * Sube una imagen a Cloudinary y la agrega al array de imágenes del proyecto
   */
  async uploadAndAddImageToProject(
    projectId: string,
    file: Express.Multer.File,
  ) {
    // 1. Buscar el proyecto
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // 2. Subir imagen a Cloudinary
    const uploadResult = await this.uploadFile(file, 'projects', 'image');

    // 3. Generar thumbnails en 3 tamaños
    const thumbnails = {
      small: cloudinary.url(uploadResult.publicId, {
        transformation: [
          {
            width: 300,
            height: 200,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      }),
      medium: cloudinary.url(uploadResult.publicId, {
        transformation: [
          {
            width: 600,
            height: 400,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      }),
      large: cloudinary.url(uploadResult.publicId, {
        transformation: [
          {
            width: 1200,
            height: 800,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      }),
    };

    // 4. Crear objeto de imagen con el formato de tu ejemplo
    const imageData = {
      publicId: uploadResult.publicId,
      secureUrl: uploadResult.secureUrl,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      thumbnails,
    };

    // 5. Agregar al array de imágenes del proyecto
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    project.images.push(imageData as any);
    await project.save();

    return {
      message: 'Image uploaded and added to project successfully',
      project: {
        _id: project._id,
        title: project.title,
        images: project.images,
      },
      uploadedImage: imageData,
    };
  }

  /**
   * Sube un video a Cloudinary y lo agrega al array de videos del proyecto
   */
  async uploadAndAddVideoToProject(
    projectId: string,
    file: Express.Multer.File,
  ) {
    // 1. Buscar el proyecto
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // 2. Subir video a Cloudinary
    const uploadResult = await this.uploadFile(file, 'projects', 'video');

    // 3. Generar thumbnail del video (frame a los 10 segundos)
    const videoThumbnail = cloudinary.url(uploadResult.publicId, {
      resource_type: 'video',
      transformation: [
        {
          width: 600,
          height: 400,
          crop: 'fill',
          start_offset: '10p', // 10% del video
        },
      ],
      format: 'jpg',
    });

    // 4. Obtener duración del video desde la respuesta de Cloudinary
    // Nota: Cloudinary devuelve duration en la respuesta de upload para videos
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const duration = (uploadResult as any).duration || 0;

    const videoData = {
      publicId: uploadResult.publicId,
      secureUrl: uploadResult.secureUrl,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      duration,
      thumbnail: videoThumbnail,
    };

    // 5. Agregar al array de videos del proyecto
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    project.videos.push(videoData as any);
    await project.save();

    return {
      message: 'Video uploaded and added to project successfully',
      project: {
        _id: project._id,
        title: project.title,
        videos: project.videos,
      },
      uploadedVideo: videoData,
    };
  }

  /**
   * Elimina una imagen de Cloudinary y la remueve del proyecto
   */
  async deleteImageFromProject(projectId: string, publicId: string) {
    // 1. Buscar el proyecto
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // 2. Eliminar de Cloudinary
    await this.deleteFile(publicId, 'image');

    // 3. Remover del array de imágenes
    project.images = project.images.filter(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (img: any) => img.publicId !== publicId,
    );
    await project.save();

    return {
      message: 'Image deleted from project successfully',
      project: {
        _id: project._id,
        title: project.title,
        images: project.images,
      },
    };
  }

  /**
   * Elimina un video de Cloudinary y lo remueve del proyecto
   */
  async deleteVideoFromProject(projectId: string, publicId: string) {
    // 1. Buscar el proyecto
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // 2. Eliminar de Cloudinary
    await this.deleteFile(publicId, 'video');

    // 3. Remover del array de videos
    project.videos = project.videos.filter(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (video: any) => video.publicId !== publicId,
    );
    await project.save();

    return {
      message: 'Video deleted from project successfully',
      project: {
        _id: project._id,
        title: project.title,
        videos: project.videos,
      },
    };
  }
}
