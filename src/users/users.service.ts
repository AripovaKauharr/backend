import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    user.role = 'USER';
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
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

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);
    if (user && role) {
      await user.$add('role', role.id);
      return dto;
    }
    throw new HttpException(
      'Пользователь или роль не найдена',
      HttpStatus.NOT_FOUND,
    );
  }

  // Новые методы:

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

  async searchUsers(query: string) {
    const searchConditions: WhereOptions = {
      [Op.or]: [
        { email: { [Op.iLike]: `%${query}%` } },
        { firstName: { [Op.iLike]: `%${query}%` } },
        { lastName: { [Op.iLike]: `%${query}%` } },
        // Добавьте другие поля, по которым нужно искать
      ],
    };

    return this.userRepository.findAll({
      where: searchConditions,
      include: { all: true },
    });
  }
}
