import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Call } from 'src/calls/call.model';
import { Op } from 'sequelize';

@Injectable()
export class AnalyticsService {
  constructor(@InjectModel(Call) private readonly callModel: typeof Call) {}

  async getAllAnalytics(from: Date, to: Date) {
    const calls = await this.callModel.findAll({
      where: {
        start_time: {
          [Op.between]: [from, to],
        },
      },
    });

    return {
      averageCompletedDuration: this.getAverageCompletedDuration(calls),
      missedPercentage: this.getMissedCallPercentage(calls),
      hourlyDistribution: this.getCallsDistributionByHour(calls),
      statusDistribution: this.getCallStatusDistribution(calls),
      avgDurationByCategory: this.getAverageDurationByCategory(calls),
      categoryDistribution: this.getCategoryDistribution(calls),
    };
  }

  private getAverageCompletedDuration(calls: Call[]) {
    const completed = calls.filter((c) => c.status === 'completed');
    if (!completed.length) return '0:00';

    const totalSeconds = completed.reduce((sum, c) => {
      return (
        sum +
        (new Date(c.end_time).getTime() - new Date(c.start_time).getTime()) /
          1000
      );
    }, 0);

    return this.formatDuration(totalSeconds / completed.length);
  }

  private getMissedCallPercentage(calls: Call[]) {
    const missed = calls.filter((c) => c.status === 'missed').length;
    return calls.length ? (missed / calls.length) * 100 : 0;
  }

  private getCallsDistributionByHour(calls: Call[]) {
    const distribution = Array(24).fill(0);
    calls.forEach((call) => {
      const hour = new Date(call.start_time).getHours();
      distribution[hour]++;
    });
    return distribution.map((count: number, hour) => ({ hour, count }));
  }

  private getCallStatusDistribution(calls: Call[]) {
    const total = calls.length;
    const counts: Record<'completed' | 'missed' | 'rejected', number> = {
      completed: 0,
      missed: 0,
      rejected: 0,
    };

    calls.forEach((call) => {
      if (Object.prototype.hasOwnProperty.call(counts, call.status)) {
        counts[call.status]++;
      }
    });

    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      percentage: total ? (count / total) * 100 : 0,
    }));
  }

  private getAverageDurationByCategory(calls: Call[]) {
    const map: Record<string, { total: number; count: number }> = {};

    calls.forEach((call) => {
      if (call.status !== 'completed') return;

      if (!map[call.category]) {
        map[call.category] = { total: 0, count: 0 };
      }

      const seconds =
        (new Date(call.end_time).getTime() -
          new Date(call.start_time).getTime()) /
        1000;
      map[call.category].total += seconds;
      map[call.category].count++;
    });

    return Object.entries(map).map(([category, { total, count }]) => ({
      category,
      averageDuration: total / count,
      averageDurationFormatted: this.formatDuration(total / count),
    }));
  }

  private formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
  private getCategoryDistribution(calls: Call[]) {
    const total = calls.length;
    const map: Record<string, number> = {};

    calls.forEach((call) => {
      if (!call.category) return;
      map[call.category] = (map[call.category] || 0) + 1;
    });

    return Object.entries(map).map(([category, count]) => ({
      category,
      percentage: total ? (count / total) * 100 : 0,
    }));
  }
}
