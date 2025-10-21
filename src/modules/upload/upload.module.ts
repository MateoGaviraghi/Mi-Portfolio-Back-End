import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { CloudinaryProvider } from '../../config/cloudinary.config';
import { Project, ProjectSchema } from '../projects/schemas/project.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [UploadController],
  providers: [UploadService, CloudinaryProvider],
  exports: [UploadService],
})
export class UploadModule {}
