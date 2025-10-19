import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ProjectCategory {
  WEB = 'web',
  MOBILE = 'mobile',
  AI = 'ai',
  BACKEND = 'backend',
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

  @Prop({ type: [String], required: true })
  technologies: string[];

  @Prop({ type: [String], default: [] })
  images: string[]; // URLs de Cloudinary

  @Prop({ type: [String], default: [] })
  videos: string[]; // URLs de Cloudinary

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
