import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Call } from './call.model';
import { CreateCallDto } from './dto/create-call.dto';
@Injectable()
export class CallService {
  constructor(
    @InjectModel(Call)
    private readonly callRepository: typeof Call,
  ) {}

  async createCall(callDto: CreateCallDto) {
    try {
      const call = await this.callRepository.create(callDto);
      return call;
    } catch (error) {
      console.error('Error creating call:', error);
      throw new Error('Ошибка при создании звонка');
    }
  }

  async getCalls({
    page = 1,
    limit = 10,
    status,
    from,
    to,
    category,
    agent_id,
  }: {
    page?: number;
    limit?: number;
    status?: string;
    from?: string;
    to?: string;
    category?: string;
    agent_id?: string;
  }) {
    try {
      const where: WhereOptions<Call> = {};

      if (status) {
        if (!['completed', 'rejected', 'missed'].includes(status)) {
          throw new Error('Invalid status value');
        }
        where.status = status;
      }

      if (category) {
        where.category = category;
      }

      if (agent_id) {
        where.agent_id = agent_id;
      }

      if (from || to) {
        const dateConditions: {
          [Op.gte]?: Date;
          [Op.lte]?: Date;
        } = {};

        if (from) {
          const fromDate = new Date(from);
          if (isNaN(fromDate.getTime()))
            throw new Error('Invalid "from" date format');
          dateConditions[Op.gte] = fromDate;
        }

        if (to) {
          const toDate = new Date(to);
          if (isNaN(toDate.getTime()))
            throw new Error('Invalid "to" date format');
          dateConditions[Op.lte] = toDate;
        }

        where.createdAt = dateConditions;
      }

      const { rows: data, count: total } =
        await this.callRepository.findAndCountAll({
          where,
          offset: (page - 1) * limit,
          limit,
          order: [['createdAt', 'DESC']],
        });

      return {
        data,
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error fetching calls:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch calls',
      );
    }
  }
}
