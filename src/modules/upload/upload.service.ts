import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { UploadResponseDto } from './dto/upload-response.dto';
import streamifier from 'streamifier';

@Injectable()
export class UploadService {
  private readonly folder: string;

  constructor(private configService: ConfigService) {
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
}
