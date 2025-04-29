import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  HttpCode,
  Header,
} from '@nestjs/common';
import { CallService } from './calls.service';
import { CreateCallDto } from './dto/create-call.dto';
import { IsOptional, IsIn } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

class GetCallsQueryDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  @IsIn(['completed', 'rejected', 'missed'])
  status?: string;

  @IsOptional()
  from?: string;

  @IsOptional()
  to?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  agent_id?: string;
}

@Controller('calls')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post()
  @HttpCode(201)
  create(@Body() callDto: CreateCallDto) {
    return this.callService.createCall(callDto);
  }

  @Get()
  @Header('Cache-Control', 'no-cache')
  async getCalls(@Query(ValidationPipe) query: GetCallsQueryDto) {
    return this.callService.getCalls(query);
  }
}
