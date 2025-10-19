import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill, SkillDocument, SkillCategory } from './schemas/skill.scehma';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<SkillDocument>,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<SkillDocument> {
    const createdSkill = new this.skillModel(createSkillDto);
    return createdSkill.save();
  }

  async findAll(filters?: {
    category?: SkillCategory;
    isActive?: boolean;
  }): Promise<SkillDocument[]> {
    const query = this.skillModel.find();

    if (filters?.category) {
      query.where('category').equals(filters.category);
    }

    if (filters?.isActive !== undefined) {
      query.where('isActive').equals(filters.isActive);
    }

    return query.sort({ category: 1, level: -1 }).exec();
  }

  async findByCategory(category: SkillCategory): Promise<SkillDocument[]> {
    return this.skillModel
      .find({ category, isActive: true })
      .sort({ level: -1 })
      .exec();
  }

  async findOne(id: string): Promise<SkillDocument> {
    const skill = await this.skillModel.findById(id).exec();

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  async update(
    id: string,
    updateSkillDto: UpdateSkillDto,
  ): Promise<SkillDocument> {
    const updatedSkill = await this.skillModel
      .findByIdAndUpdate(id, updateSkillDto, { new: true })
      .exec();

    if (!updatedSkill) {
      throw new NotFoundException('Skill not found');
    }

    return updatedSkill;
  }

  async remove(id: string): Promise<void> {
    const result = await this.skillModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Skill not found');
    }
  }

  async getSkillsByLevel(minLevel: number): Promise<SkillDocument[]> {
    return this.skillModel
      .find({ level: { $gte: minLevel }, isActive: true })
      .sort({ level: -1 })
      .exec();
  }

  async getStats() {
    const skills = await this.skillModel.find({ isActive: true }).exec();

    const statsByCategory = skills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = { count: 0, avgLevel: 0, totalLevel: 0 };
        }
        acc[skill.category].count += 1;
        acc[skill.category].totalLevel += skill.level;
        return acc;
      },
      {} as Record<
        string,
        { count: number; avgLevel: number; totalLevel: number }
      >,
    );

    // Calcular promedio
    Object.keys(statsByCategory).forEach((category) => {
      const stats = statsByCategory[category];
      stats.avgLevel = Math.round(stats.totalLevel / stats.count);
    });

    return {
      total: skills.length,
      byCategory: statsByCategory,
      topSkills: skills.sort((a, b) => b.level - a.level).slice(0, 5),
    };
  }
}
