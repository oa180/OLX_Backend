import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { EmailService } from 'src/email/email.service';

@Module({
  providers: [OrderService, EmailService],
  controllers: [OrderController],
})
export class OrderModule {}
