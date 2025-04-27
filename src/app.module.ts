import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CallsModule } from './calls/calls.module';
import { UsersController } from './users/users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { Call } from './calls/call.model';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, Call],
      autoLoadModels: true,
    }),
    SequelizeModule.forFeature([Call]),
    CallsModule,
    UsersModule,
    RolesModule,
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
