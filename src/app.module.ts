import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CallsModule } from './calls/calls.module';
import { UsersController } from './users/users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.model';
import { Call } from './calls/call.model';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Call],
      autoLoadModels: true,
      synchronize: true,
    }),
    SequelizeModule.forFeature([Call]),
    CallsModule,
    UsersModule,
    AuthModule,
    AnalyticsModule,
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
