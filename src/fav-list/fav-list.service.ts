import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavListService {
  constructor(private prisma: PrismaService) {}

  async getUserFavList(uid: number) {
    try {
      const userFavList = await this.prisma.user.findUnique({
        where: {
          id: uid,
        },
        select: {
          favList: { select: { post: true } },
        },
      });

      return userFavList;
    } catch (err) {
      throw new ForbiddenException('Database Error');
    }
  }
  async addPostToFavList(uid: number, pid: number) {
    try {
      const favList = await this.prisma.favList.create({
        data: {
          userId: uid,
          postId: pid,
        },
      });
      return favList;
    } catch (err) {
      throw new ForbiddenException('Database Error');
    }
  }

  async deletePostFromFavList(uid: number, pid: number) {
    try {
      await this.prisma.favList.deleteMany({
        where: {
          userId: uid,
          postId: pid,
        },
      });
      return 'Deleted';
    } catch (err) {
      throw new ForbiddenException('Database Error');
    }
  }
}
