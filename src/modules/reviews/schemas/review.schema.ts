import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true, trim: true, maxlength: 1000 })
  comment: string;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ trim: true })
  company?: string;

  @Prop({ trim: true })
  position?: string;

  @Prop({ trim: true })
  avatarUrl?: string;
}

export type ReviewDocument = Review & Document;
export const ReviewSchema = SchemaFactory.createForClass(Review);

// Índices
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ isPublic: 1, createdAt: -1 });
