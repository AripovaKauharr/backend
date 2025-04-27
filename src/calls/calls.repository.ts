import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Call } from './call.model';

@Injectable()
export class CallRepository {
  constructor(@InjectModel(Call) private readonly callModel: typeof Call) {}

  async findCalls(query: any) {
    // Пример фильтрации на основе query
    return this.callModel.findAll({
      where: query, // можно сделать фильтрацию на уровне базы данных
      limit: query.limit || 10, // пагинация, по умолчанию 10
      offset: query.page ? query.page * 10 : 0, // вычисляем offset для пагинации
    });
  }
}
