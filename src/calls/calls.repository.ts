import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Call } from './call.model';

@Injectable()
export class CallRepository {
  constructor(@InjectModel(Call) private readonly callModel: typeof Call) {}

  async findCalls(query: any) {
    return this.callModel.findAll({
      where: query,
      limit: query.limit || 10,
      offset: query.page ? query.page * 10 : 0,
    });
  }
}
