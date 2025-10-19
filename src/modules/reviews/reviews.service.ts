import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<ReviewDocument> {
    const createdReview = new this.reviewModel({
      ...createReviewDto,
      user: new Types.ObjectId(userId),
    });
    return createdReview.save();
  }

  async findAll(filters?: { isPublic?: boolean }): Promise<ReviewDocument[]> {
    const query = this.reviewModel.find();

    if (filters?.isPublic !== undefined) {
      query.where('isPublic').equals(filters.isPublic);
    }

    return query
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPublicReviews(): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ isPublic: true })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByUser(userId: string): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<ReviewDocument> {
    const review = await this.reviewModel
      .findById(id)
      .populate('user', 'name email avatar')
      .exec();

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewDocument> {
    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .populate('user', 'name email avatar')
      .exec();

    if (!updatedReview) {
      throw new NotFoundException('Review not found');
    }

    return updatedReview;
  }

  async approve(id: string): Promise<ReviewDocument> {
    return this.update(id, { isPublic: true });
  }

  async reject(id: string): Promise<ReviewDocument> {
    return this.update(id, { isPublic: false });
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Review not found');
    }
  }

  async getStats() {
    const reviews = await this.reviewModel.find({ isPublic: true }).exec();

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        : 0;

    const ratingDistribution = reviews.reduce(
      (acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    return {
      total: totalReviews,
      avgRating: Math.round(avgRating * 10) / 10,
      ratingDistribution,
    };
  }
}
