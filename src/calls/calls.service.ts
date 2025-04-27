import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
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
    page,
    limit,
    status,
  }: {
    page: number;
    limit: number;
    status?: string;
  }) {
    if (status && !['1', '2', '3'].includes(status)) {
      throw new Error('Неверный статус');
    }

    try {
      const where = status ? { status } : {};
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
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error fetching calls:', error);
      throw new Error('Ошибка при получении звонков');
    }
  }
}
