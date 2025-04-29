import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'ktoto ivan',
    description: 'Имя пользователя',
    required: false,
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly userName: string;
  @ApiProperty({
    example: 'user@mail.ru',
    description: 'Почта',
    required: false,
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;
  @ApiProperty({ example: '12345', description: 'пароль', required: false })
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 16, { message: 'Не меньше 4 и не больше 16' })
  readonly password: string;
  @ApiProperty({ example: 'USER', description: 'Роль', required: false })
  @IsString({ message: 'Должно быть строкой' })
  readonly role: string;
}
