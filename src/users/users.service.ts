import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    user.role = 'USER';
    return user;
  }

  async getAllUsers(search?: string) {
    const options: {
      where?: {
        [Op.or]?: Array<{
          [key: string]: { [Op.iLike]: string };
        }>;
      };
      include: any;
    } = { include: { all: true } };

    if (search) {
      options.where = {
        [Op.or]: [
          { email: { [Op.iLike]: `%${search}%` } },
          { userName: { [Op.iLike]: `%${search}%` } },
          { role: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    const users = await this.userRepository.findAll(options);
    return users;
  }

  async findOne(options: any) {
    return this.userRepository.findOne(options);
  }

  async getUsersByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    await user.update(dto);
    return user;
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findByPk(id);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    await user.destroy();
    return { message: 'Пользователь успешно удален' };
  }
}
