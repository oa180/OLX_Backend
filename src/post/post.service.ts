import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/user-role.enum';
import { CRUD } from 'src/factory/crud.factory';
import { RolesGuard } from 'src/guard/roles.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  crud = new CRUD();

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async findAll() {
    try {
      const post = await this.prisma.post.findMany({
        include: { likes: true, comments: true },
      });
      return post;
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: number) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: { likes: true, comments: true },
      });
      return post;
    } catch (err) {
      throw err;
    }
  }

  async create(createPostDto: CreatePostDto, id: number) {
    try {
      const newPost = await this.prisma.post.create({
        data: {
          delivery: createPostDto.delivery,
          pname: createPostDto.pname,
          images: createPostDto.image,
          description: createPostDto.description,
          price: createPostDto.price,
          categoryId: createPostDto.categoryId,
          contactMethod: createPostDto.contactMethod,
          userId: id,
        },
      });
      // console.log(newPost);
      return newPost;
    } catch (err) {
      throw err;
    }
  }

  update(updatePostDto: UpdatePostDto, id: number) {
    return this.crud.update(this.prisma.post, id, updatePostDto);
  }

  delete(id: number) {
    return this.crud.delete(this.prisma.post, id);
  }

  async getPostComments(pid: number) {
    try {
      const postComments = await this.prisma.comment.findMany({
        where: { postId: pid },
      });
      if (postComments.length == 0)
        throw new HttpException('No comments on this post yet!', 200);
      return postComments;
    } catch (err) {
      return err;
    }
  }

  async createPostComments(
    createCommentDto: CreateCommentDto,
    pid: number,
    uid: number,
  ) {
    try {
      const currentDate = new Date(Date.now());
      const newComment = await this.prisma.comment.create({
        data: {
          content: createCommentDto.content,
          userId: uid,
          postId: pid,
          date: currentDate,
        },
      });

      return newComment;
    } catch (err) {
      throw err;
    }
  }

  async getPostLikes(pid: number) {
    try {
      const Likes = await this.prisma.like.findMany({
        where: { postId: pid },
      });
      if (Likes.length == 0)
        throw new HttpException('No likes on this post yet!', 200);
      return Likes;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new BadRequestException('Wrong Post ID!');
      throw err;
    }
  }

  async createPostLikes(pid: number, uid: number) {
    try {
      const currentDate = new Date(Date.now());
      const newLike = await this.prisma.like.create({
        data: {
          userId: uid,
          postId: pid,
          date: currentDate,
        },
      });

      return newLike;
    } catch (err) {
      throw new ForbiddenException('Already liked this post');
    }
  }
}
