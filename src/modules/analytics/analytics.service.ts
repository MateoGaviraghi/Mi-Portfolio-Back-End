/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import {
  Analytics,
  AnalyticsDocument,
  EventType,
} from './schemas/analytics.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics.name)
    private analyticsModel: Model<AnalyticsDocument>,
  ) {}

  async trackEvent(
    createAnalyticsDto: CreateAnalyticsDto,
  ): Promise<AnalyticsDocument> {
    const event = new this.analyticsModel(createAnalyticsDto);
    return event.save();
  }

  async getOverview(startDate?: Date, endDate?: Date) {
    const query: any = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    const [totalEvents, eventsByType, uniqueSessions, topPages] =
      await Promise.all([
        this.analyticsModel.countDocuments(query),
        this.analyticsModel.aggregate([
          { $match: query },
          { $group: { _id: '$eventType', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        this.analyticsModel.distinct('sessionId', query).then((r) => r.length),
        this.analyticsModel.aggregate([
          { $match: { ...query, eventType: EventType.PAGE_VIEW } },
          { $group: { _id: '$page', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
      ]);

    return {
      totalEvents,
      uniqueSessions,
      eventsByType: eventsByType.reduce(
        (acc, item) => {
          acc[item._id] = item.count;
          return acc;
        },
        {} as Record<string, number>,
      ),
      topPages: topPages.map((p) => ({ page: p._id, views: p.count })),
    };
  }

  async getDeviceStats(startDate?: Date, endDate?: Date) {
    const query: any = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    const [devices, browsers, os] = await Promise.all([
      this.analyticsModel.aggregate([
        { $match: query },
        { $group: { _id: '$device', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      this.analyticsModel.aggregate([
        { $match: query },
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      this.analyticsModel.aggregate([
        { $match: query },
        { $group: { _id: '$os', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return {
      devices: devices.map((d) => ({ device: d._id, count: d.count })),
      browsers: browsers.map((b) => ({ browser: b._id, count: b.count })),
      operatingSystems: os.map((o) => ({ os: o._id, count: o.count })),
    };
  }

  async getGeoStats(startDate?: Date, endDate?: Date) {
    const query: any = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    const [countries, cities] = await Promise.all([
      this.analyticsModel.aggregate([
        { $match: { ...query, country: { $exists: true, $ne: null } } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
      this.analyticsModel.aggregate([
        { $match: { ...query, city: { $exists: true, $ne: null } } },
        {
          $group: {
            _id: { city: '$city', country: '$country' },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
    ]);

    return {
      countries: countries.map((c) => ({ country: c._id, count: c.count })),
      cities: cities.map((c) => ({
        city: c._id.city,
        country: c._id.country,
        count: c.count,
      })),
    };
  }

  async getTimeSeriesData(
    eventType?: EventType,
    interval: 'hour' | 'day' | 'week' | 'month' = 'day',
    startDate?: Date,
    endDate?: Date,
  ) {
    const query: any = {};
    if (eventType) query.eventType = eventType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    let dateFormat: any;
    switch (interval) {
      case 'hour':
        dateFormat = {
          $dateToString: { format: '%Y-%m-%d %H:00', date: '$createdAt' },
        };
        break;
      case 'day':
        dateFormat = {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        };
        break;
      case 'week':
        dateFormat = {
          $dateToString: { format: '%Y-W%V', date: '$createdAt' },
        };
        break;
      case 'month':
        dateFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        break;
    }

    const timeSeries = await this.analyticsModel.aggregate([
      { $match: query },
      { $group: { _id: dateFormat, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return timeSeries.map((t) => ({ date: t._id, count: t.count }));
  }

  async getReferrerStats(startDate?: Date, endDate?: Date) {
    const matchQuery: Record<string, unknown> = {
      referrer: { $exists: true, $nin: [null, ''] },
    };

    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.$gte = startDate;
      if (endDate) dateFilter.$lte = endDate;
      matchQuery.createdAt = dateFilter;
    }

    const referrers = await this.analyticsModel.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    return referrers.map((r: { _id: string; count: number }) => ({
      referrer: r._id,
      count: r.count,
    }));
  }

  async getSessionAnalytics(sessionId: string) {
    const events = await this.analyticsModel
      .find({ sessionId })
      .sort({ createdAt: 1 })
      .exec();

    if (events.length === 0) {
      return null;
    }

    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];
    const duration =
      firstEvent.createdAt && lastEvent.createdAt
        ? (lastEvent.createdAt.getTime() - firstEvent.createdAt.getTime()) /
          1000
        : 0;

    return {
      sessionId,
      eventsCount: events.length,
      duration,
      events: events.map((e) => ({
        type: e.eventType,
        page: e.page,
        timestamp: e.createdAt,
      })),
      device: firstEvent.device,
      browser: firstEvent.browser,
      country: firstEvent.country,
    };
  }

  async cleanOldData(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.analyticsModel
      .deleteMany({ createdAt: { $lt: cutoffDate } })
      .exec();

    return result.deletedCount;
  }
}
