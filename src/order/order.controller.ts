import { Controller } from '@nestjs/common';
import { Post, Body, Get, Param } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderService } from './order.service';

@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  getOrders(@GetUser('id') id: number) {
    return this.orderService.getOrder(id);
  }

  @Post()
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser('email') email: string,
  ) {
    return this.orderService.createOrders(createOrderDto, email);
  }
}
