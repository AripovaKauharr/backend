import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CallService } from './calls.service';
import { CallRepository } from './calls.repository';
import { Call } from './call.model';
import { CallController } from './calls.controller';

@Module({
  imports: [SequelizeModule.forFeature([Call])],
  controllers: [CallController],
  providers: [CallService, CallRepository],
  exports: [SequelizeModule],
})
export class CallsModule {}
