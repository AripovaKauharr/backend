import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Call } from './call.model';

interface CallQueryRepository {
  limit?: number;
  offset?: number;
  status?: string;
  from?: string;
  to?: string;
  category?: string;
  agent_id?: string;
}

@Injectable()
export class CallRepository {
  constructor(@InjectModel(Call) private readonly callModel: typeof Call) {}

  async findCalls(query: CallQueryRepository) {
    const where: WhereOptions<Call> = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.agent_id) {
      where.agent_id = query.agent_id;
    }

    if (query.from || query.to) {
      const dateConditions: { [Op.gte]?: Date; [Op.lte]?: Date } = {};

      if (query.from) {
        const fromDate = new Date(query.from);
        if (!isNaN(fromDate.getTime())) {
          dateConditions[Op.gte] = fromDate;
        }
      }

      if (query.to) {
        const toDate = new Date(query.to);
        if (!isNaN(toDate.getTime())) {
          dateConditions[Op.lte] = toDate;
        }
      }

      where.createdAt = dateConditions;
    }

    return this.callModel.findAll({
      where,
      limit: query.limit ?? 10,
      offset: query.offset ?? 0,
      order: [['createdAt', 'DESC']],
    });
  }
}
