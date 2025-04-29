import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/user.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  private generateToken(user: User) {
    const plainUser = { ...user };
    return { token: this.jwtService.sign(plainUser.dataValues) };
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUsersByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь уже зарегистрирован',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.findOne({
      where: { email: userDto.email },
      select: ['id', 'email', 'role'],
    });
    if (!user) {
      throw new UnauthorizedException('Некорректный email или пароль');
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.dataValues.password,
    );
    if (passwordEquals) {
      return user;
    }
    throw new UnauthorizedException('Некорректный email или пароль');
  }
}
