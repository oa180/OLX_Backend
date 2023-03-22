import { IsString, IsNumber, IsEnum, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { payementMethod } from '../payment.enum';

export class CreateOrderDto {
  @IsEnum(payementMethod)
  payement: string;

  @IsArray()
  items: any;
}
