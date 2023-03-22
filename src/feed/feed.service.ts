import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async getFeed() {
    try {
      const feed = await this.prisma.post.findMany({
        include: { _count: { select: { likes: true, comments: true } } },
      });
      if (!feed || feed.length == 0)
        throw new HttpException('Something Went wrong loading feed!', 404);
      return feed;
    } catch (err) {
      throw err;
    }
  }
}
