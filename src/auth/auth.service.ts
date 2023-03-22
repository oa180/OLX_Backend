import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    try {
      // check if password match
      if (signupDto.password !== signupDto.passwordConfirm)
        throw new Error('Passwords doesnt match');

      signupDto.passwordConfirm = undefined;

      // encrypt password
      const hashedPassword = await bcrypt.hash(signupDto.password, 10);

      // create new user
      const newUser = await this.prisma.user.create({
        data: {
          // fname: signupDto.fname,
          // lname: signupDto.lname,
          // email: signupDto.email,
          // password: hashedPassword,
          // phone: signupDto.phone,
          // dob: signupDto.dob,
          // gender: signupDto.gender,
          ...signupDto,

          password: hashedPassword,
        },
      });

      delete newUser.password;

      return this.signToken(newUser.id, newUser.email);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002')
          throw new ForbiddenException('Credentials taken!');
      }

      throw new HttpException(err.message, 400);
    }
  }

  async signin(signinDto) {
    try {
      // find a user by email
      const user = await this.prisma.user.findFirst({
        where: {
          email: signinDto.email,
        },
      });

      // check if user exists
      if (!user) throw new Error('Wrong email or password!');

      // check password

      const passCheck = await bcrypt.compare(signinDto.password, user.password);

      if (!passCheck) throw new Error('Wrong email or password!');

      // return user
      return this.signToken(user.id, user.email);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async signToken(userId: number, email: string): Promise<{ jwt: string }> {
    const payload = {
      userId,
      email,
    };

    const jwt = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
      secret: this.config.get('JWT_SECRET'),
    });
    return { jwt };
  }

  async assignAdmin(userId: number) {
    try {
      const userToAdmin = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: 'admin',
        },
      });
      return userToAdmin;
    } catch (err) {
      throw err;
    }
  }
}
