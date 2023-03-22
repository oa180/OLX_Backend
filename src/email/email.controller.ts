import { Body, Controller, Get, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtGuard } from 'src/guard/jwt.guard';
import { EmailService } from './email.service';

@UseGuards(JwtGuard)
@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post()
  sendEmail(@GetUser('email') email: string, @Body() body: any) {
    return this.emailService.sendPlainEmail(email, body.subject, body.content);
  }
}
