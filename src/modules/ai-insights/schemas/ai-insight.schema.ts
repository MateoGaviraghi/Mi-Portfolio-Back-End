import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum InsightType {
  CODE_GENERATION = 'code_generation',
  CODE_REVIEW = 'code_review',
  DEBUGGING = 'debugging',
  OPTIMIZATION = 'optimization',
  DOCUMENTATION = 'documentation',
  TESTING = 'testing',
  ARCHITECTURE = 'architecture',
  OTHER = 'other',
}

export enum AITool {
  GITHUB_COPILOT = 'github_copilot',
  CHATGPT = 'chatgpt',
  CLAUDE = 'claude',
  CURSOR = 'cursor',
  TABNINE = 'tabnine',
  CODEWHISPERER = 'codewhisperer',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class AiInsight {
  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projectId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, enum: InsightType })
  type: InsightType;

  @Prop({ type: [String], enum: AITool, default: [] })
  aiTools: AITool[];

  @Prop({ min: 0, max: 100 })
  impactPercentage?: number; // % de impacto de la IA en esta tarea

  @Prop({ trim: true })
  codeSnippet?: string; // Código ejemplo generado/mejorado por IA

  @Prop({ trim: true })
  beforeCode?: string; // Código antes de la IA

  @Prop({ trim: true })
  afterCode?: string; // Código después de la IA

  @Prop()
  timeSaved?: number; // Tiempo ahorrado en minutos

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ type: Object })
  metrics?: {
    linesOfCode?: number;
    complexity?: number;
    performance?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export type AiInsightDocument = AiInsight & Document;
export const AiInsightSchema = SchemaFactory.createForClass(AiInsight);

// Índices
AiInsightSchema.index({ type: 1, createdAt: -1 });
AiInsightSchema.index({ projectId: 1 });
AiInsightSchema.index({ aiTools: 1 });
