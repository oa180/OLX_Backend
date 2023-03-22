import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, HttpCode, HttpException } from '@nestjs/common';

export class CRUD {
  constructor() {}

  async findAll(model: any) {
    try {
      const modelResult = await model.findMany();
      if (!modelResult) return { [modelResult.name + 's']: {} };
      modelResult.forEach((user: any) => delete user.password);
      return modelResult;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError)
        throw new ForbiddenException('Prisma Error');
      throw err;
    }
  }

  async findOne(model: any, id: number) {
    try {
      const modelResult = await model.findUnique({
        where: { id },
      });

      if (!modelResult)
        throw new HttpException(`Wrong ${model.name} ID: ${id}`, 404);

      delete modelResult.password;
      return modelResult;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError)
        throw new ForbiddenException('Prisma Error');
      throw err;
    }
  }

  // async create(model: any, createModelDto: any) {}

  async update(model: any, id: any, updateModelDto: any) {
    try {
      const mdoelResult = await model.update({
        where: { id },
        data: {
          ...updateModelDto,
        },
      });
      console.log(mdoelResult);

      if (!mdoelResult) throw new Error(`Wrong ${model.name} ID: ${id}`);
      return mdoelResult;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError)
        throw new HttpException('Prisma Error!', 400);
      throw err;
    }
  }

  async delete(model: any, id: number) {
    try {
      await model.delete({
        where: { id },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError)
        throw new HttpException(`Wrong id: ${id} `, 404);
      throw err;
    }
  }
}
