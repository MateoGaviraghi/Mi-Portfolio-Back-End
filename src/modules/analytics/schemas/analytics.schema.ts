import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum EventType {
  PAGE_VIEW = 'page_view',
  PROJECT_VIEW = 'project_view',
  PROJECT_LIKE = 'project_like',
  SKILL_VIEW = 'skill_view',
  REVIEW_VIEW = 'review_view',
  CONTACT_FORM = 'contact_form',
  DOWNLOAD_CV = 'download_cv',
  EXTERNAL_LINK = 'external_link',
}

@Schema({ timestamps: true })
export class Analytics {
  @Prop({ required: true, enum: EventType })
  eventType: EventType;

  @Prop({ trim: true })
  page?: string; // Ruta de la página

  @Prop({ trim: true })
  referrer?: string; // De dónde viene el usuario

  @Prop({ trim: true })
  userAgent?: string; // Navegador y dispositivo

  @Prop({ trim: true })
  ip?: string; // IP del usuario (hasheada por privacidad)

  @Prop({ trim: true })
  country?: string;

  @Prop({ trim: true })
  city?: string;

  @Prop({ trim: true })
  device?: string; // mobile, tablet, desktop

  @Prop({ trim: true })
  browser?: string; // chrome, firefox, safari, etc.

  @Prop({ trim: true })
  os?: string; // windows, mac, linux, etc.

  @Prop({ type: Object })
  metadata?: Record<string, any>; // Datos adicionales específicos del evento

  @Prop()
  sessionId?: string; // Para agrupar eventos de la misma sesión

  @Prop({ default: 0 })
  duration?: number; // Duración en segundos (para page views)

  createdAt?: Date;
  updatedAt?: Date;
}

export type AnalyticsDocument = Analytics & Document;
export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);

// Índices para queries eficientes
AnalyticsSchema.index({ eventType: 1, createdAt: -1 });
AnalyticsSchema.index({ sessionId: 1 });
AnalyticsSchema.index({ createdAt: -1 });
