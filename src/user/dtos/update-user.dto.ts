import { PartialType } from '@nestjs/mapped-types';
import { SignupDto } from 'src/auth/dtos/signup.dto';

export class UpdateUserDto extends PartialType(SignupDto) {}
