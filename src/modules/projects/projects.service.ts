import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  Project,
  ProjectDocument,
  ProjectCategory,
} from './schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<ProjectDocument> {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  async findAll(filters?: {
    category?: ProjectCategory;
    featured?: boolean;
  }): Promise<ProjectDocument[]> {
    const query = this.projectModel.find();

    if (filters?.category) {
      query.where('category').equals(filters.category);
    }

    if (filters?.featured !== undefined) {
      query.where('featured').equals(filters.featured);
    }

    return query.sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id).exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Incrementar vistas
    project.stats.views += 1;
    await project.save();

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectDocument> {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .exec();

    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }

    return updatedProject;
  }

  async remove(id: string): Promise<void> {
    const result = await this.projectModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Project not found');
    }
  }

  async incrementLikes(id: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id).exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    project.stats.likes += 1;
    return project.save();
  }

  async search(query: string): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ $text: { $search: query } })
      .sort({ score: { $meta: 'textScore' } })
      .exec();
  }
}
