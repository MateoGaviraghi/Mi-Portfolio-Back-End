import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ProjectCategory {
  WEB = 'web',
  MOBILE = 'mobile',
  AI = 'ai',
  BACKEND = 'backend',
}

// Sub-schema para archivos multimedia de Cloudinary
class CloudinaryFile {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;

  @Prop()
  width?: number;

  @Prop()
  height?: number;

  @Prop()
  format?: string;

  @Prop()
  resourceType?: string;

  @Prop()
  thumbnail?: string;
}

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  longDescription: string;

  @Prop({ required: true })
  technologies: string[];

  @Prop({ type: [CloudinaryFile], default: [] })
  images: CloudinaryFile[];

  @Prop({ type: [CloudinaryFile], default: [] })
  videos: CloudinaryFile[];

  @Prop()
  githubUrl?: string;

  @Prop()
  liveUrl?: string;

  @Prop({ type: String, enum: ProjectCategory, required: true })
  category: ProjectCategory;

  @Prop({ default: false })
  featured: boolean;

  @Prop({
    type: {
      percentage: { type: Number, default: 0 },
      tools: { type: [String], default: [] },
      description: { type: String, default: '' },
    },
    default: { percentage: 0, tools: [], description: '' },
  })
  aiGenerated: {
    percentage: number;
    tools: string[];
    description: string;
  };

  @Prop({
    type: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
    },
    default: { views: 0, likes: 0 },
  })
  stats: {
    views: number;
    likes: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

// Índices
ProjectSchema.index({ title: 'text', description: 'text' });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ featured: 1 });
