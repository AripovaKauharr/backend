import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.model';
import { AddRoleDto } from './dto/add-role.dto';

@ApiTags('UserTag')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Получение списка пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAllUser() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Выдача роли' })
  @ApiResponse({ status: 200, type: [User] })
  @Get('role')
  addRole(@Body() dto: AddRoleDto) {
    return this.usersService.addRole(dto);
  }
}
