import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.model';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @ApiOperation({
    summary: 'Получение списка пользователей с возможностью поиска',
  })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAllUser(@Query('search') search?: string) {
    return this.usersService.getAllUsers(search);
  }

  @ApiOperation({ summary: 'Обновление пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiResponse({ status: 200, type: Object })
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
