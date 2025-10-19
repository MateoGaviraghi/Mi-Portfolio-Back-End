import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum SkillCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  DEVOPS = 'devops',
  TOOLS = 'tools',
  AI = 'ai',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Skill {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: SkillCategory })
  category: SkillCategory;

  @Prop({ required: true, min: 0, max: 100 })
  level: number;

  @Prop({ trim: true })
  icon?: string; // URL del icono o nombre del icono (ej: "react", "nodejs")

  @Prop({ min: 0 })
  yearsExperience?: number;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: [String], default: [] })
  relatedProjects?: string[]; // IDs de proyectos relacionados

  @Prop({ default: true })
  isActive: boolean; // Para mostrar/ocultar skills sin eliminarlas
}

export type SkillDocument = Skill & Document;
export const SkillSchema = SchemaFactory.createForClass(Skill);

// Índices
SkillSchema.index({ category: 1, level: -1 });
SkillSchema.index({ name: 1 });
