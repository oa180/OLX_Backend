import { Controller, Post, Body } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { JwtGuard } from 'src/guard/jwt.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';
import { Role } from './enums/user-role.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    console.log(signupDto);
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('assignadmin')
  assignAdmin(@Body('userId') userId: number) {
    return this.authService.assignAdmin(userId);
  }
}
