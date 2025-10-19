/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateAiInsightDto } from './dto/create-ai-insight.dto';
import { UpdateAiInsightDto } from './dto/update-ai-insight.dto';
import {
  AiInsight,
  AiInsightDocument,
  InsightType,
} from './schemas/ai-insight.schema';

@Injectable()
export class AiInsightsService {
  constructor(
    @InjectModel(AiInsight.name)
    private aiInsightModel: Model<AiInsightDocument>,
  ) {}

  async create(
    createAiInsightDto: CreateAiInsightDto,
  ): Promise<AiInsightDocument> {
    const insight = new this.aiInsightModel({
      ...createAiInsightDto,
      projectId: createAiInsightDto.projectId
        ? new Types.ObjectId(createAiInsightDto.projectId)
        : undefined,
    });
    return insight.save();
  }

  async findAll(filters?: {
    type?: InsightType;
    projectId?: string;
    isPublic?: boolean;
  }): Promise<AiInsightDocument[]> {
    const query = this.aiInsightModel.find();

    if (filters?.type) {
      query.where('type').equals(filters.type);
    }

    if (filters?.projectId) {
      query.where('projectId').equals(new Types.ObjectId(filters.projectId));
    }

    if (filters?.isPublic !== undefined) {
      query.where('isPublic').equals(filters.isPublic);
    }

    return query.populate('projectId', 'title').sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<AiInsightDocument> {
    const insight = await this.aiInsightModel
      .findById(id)
      .populate('projectId', 'title description')
      .exec();

    if (!insight) {
      throw new NotFoundException('AI Insight not found');
    }

    return insight;
  }

  async findByProject(projectId: string): Promise<AiInsightDocument[]> {
    return this.aiInsightModel
      .find({ projectId: new Types.ObjectId(projectId), isPublic: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateAiInsightDto: UpdateAiInsightDto,
  ): Promise<AiInsightDocument> {
    const updateData: any = { ...updateAiInsightDto };
    if (updateAiInsightDto.projectId) {
      updateData.projectId = new Types.ObjectId(updateAiInsightDto.projectId);
    }

    const updatedInsight = await this.aiInsightModel
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('projectId', 'title')
      .exec();

    if (!updatedInsight) {
      throw new NotFoundException('AI Insight not found');
    }

    return updatedInsight;
  }

  async remove(id: string): Promise<void> {
    const result = await this.aiInsightModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('AI Insight not found');
    }
  }

  async getStats() {
    const [totalInsights, byType, byTool, totalTimeSaved] = await Promise.all([
      this.aiInsightModel.countDocuments({ isPublic: true }),
      this.aiInsightModel.aggregate([
        { $match: { isPublic: true } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      this.aiInsightModel.aggregate([
        { $match: { isPublic: true } },
        { $unwind: '$aiTools' },
        { $group: { _id: '$aiTools', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      this.aiInsightModel.aggregate([
        { $match: { isPublic: true, timeSaved: { $exists: true } } },
        { $group: { _id: null, total: { $sum: '$timeSaved' } } },
      ]),
    ]);

    const avgImpact = await this.aiInsightModel.aggregate([
      {
        $match: { isPublic: true, impactPercentage: { $exists: true } },
      },
      { $group: { _id: null, avg: { $avg: '$impactPercentage' } } },
    ]);

    return {
      totalInsights,
      insightsByType: byType.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item._id] = item.count;
          return acc;
        },
        {},
      ),
      toolsUsage: byTool.map((t: any) => ({ tool: t._id, count: t.count })),
      totalTimeSavedMinutes: totalTimeSaved[0]?.total || 0,
      totalTimeSavedHours:
        Math.round(((totalTimeSaved[0]?.total || 0) / 60) * 10) / 10,
      averageImpactPercentage: Math.round((avgImpact[0]?.avg as number) || 0),
    };
  }

  async getTopInsights(limit: number = 10): Promise<AiInsightDocument[]> {
    return this.aiInsightModel
      .find({ isPublic: true })
      .sort({ impactPercentage: -1, timeSaved: -1 })
      .limit(limit)
      .populate('projectId', 'title')
      .exec();
  }
}
