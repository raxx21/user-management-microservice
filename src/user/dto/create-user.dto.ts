import { IsString, IsDate } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  username: string;

  @IsString()
  birthdate: string;

  @IsString()
  email: string;
}
