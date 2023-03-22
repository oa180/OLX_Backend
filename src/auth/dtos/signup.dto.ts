import { IsString, IsEmail, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class SignupDto {
  @IsString()
  fname: string;

  @IsString()
  lname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  passwordConfirm: string;

  @IsString()
  phone: string;

  @Type(() => Date)
  @IsDate()
  dob: Date;

  @IsString()
  gender: string;
}
