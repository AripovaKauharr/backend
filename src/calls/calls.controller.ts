import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CallService } from './calls.service';
import { CreateCallDto } from './dto/create-call.dto';

@Controller('calls')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post()
  create(@Body() callDto: CreateCallDto) {
    return this.callService.createCall(callDto);
  }
  @Get()
  async getCalls(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
  ) {
    try {
      return await this.callService.getCalls({ page, limit, status });
    } catch (error) {
      console.error('Error in getCalls controller:', error);
      throw new Error('Ошибка при получении звонков');
    }
  }
}
