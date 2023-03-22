import { Injectable } from '@nestjs/common';
import { CRUD } from 'src/factory/crud.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  crud = new CRUD();

  findAll() {
    return this.crud.findAll(this.prisma.user);
  }

  findOne(id: number) {
    return this.crud.findOne(this.prisma.user, id);
  }

  create() {}

  update(id: number, updateUserDto: UpdateUserDto) {
    delete updateUserDto.password;
    delete updateUserDto.passwordConfirm;
    // console.log(updateUserDto);

    return this.crud.update(this.prisma.user, id, updateUserDto);
  }

  delete(id: number) {
    this.crud.delete(this.prisma.user, id);
  }
}
