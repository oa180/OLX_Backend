import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { ContactMethod } from '../contact-method.enum';
export class CreatePostDto {
  @IsString()
  pname: string;

  @IsNumber()
  categoryId?: number;

  @IsString()
  image: string;

  @IsBoolean()
  delivery: boolean;

  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsEnum(ContactMethod)
  contactMethod: string;
}
