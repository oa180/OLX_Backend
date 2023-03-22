import {
  Controller,
  Get,
  UseGuards,
  Body,
  Post,
  Req,
  Patch,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetToken } from 'src/auth/decorators/get-token.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { EmailService } from 'src/email/email.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';

// @UseGuards(AuthGuard('jwt'))
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private emailService: EmailService,
  ) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // @Post()
  // create() {}

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    this.userService.delete(id);
  }

  @Get('/me/:id')
  getMe(
    @Req() req: Request,
    @GetToken() token: string,
    @GetUser('lname') email: string,
  ) {
    return { token };
  }

  @Post('forget/email')
  forgetPass(@Body('email') email: string) {
    console.log(email);
    return this.emailService.sendPlainEmail(
      email,
      'plain text',
      'sendplain text',
    );
  }
}
