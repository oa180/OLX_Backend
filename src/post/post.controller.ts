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
  SetMetadata,
} from '@nestjs/common';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetToken } from 'src/auth/decorators/get-token.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/user-role.enum';
import { JwtGuard } from 'src/guard/jwt.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostService } from './post.service';

// @UseGuards(AuthGuard('jwt'))
@UseGuards(JwtGuard)
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser('id', ParseIntPipe) author: number,
  ) {
    return this.postService.create(createPostDto, author);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser('id') userId: number,
  ) {
    return this.postService.update(updatePostDto, id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    this.postService.delete(id);
  }

  @Get('comments/:pid')
  getPostComments(@Param('pid', ParseIntPipe) pid: number) {
    return this.postService.getPostComments(pid);
  }

  @Post('comments/:pid')
  createPostComments(
    @GetUser('id', ParseIntPipe) uid: number,
    @Param('pid', ParseIntPipe) pid: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postService.createPostComments(createCommentDto, pid, uid);
  }

  @Get('likes/:pid')
  getPostLikes(@Param('pid', ParseIntPipe) pid: number) {
    return this.postService.getPostLikes(pid);
  }

  @Post('likes/:pid')
  createPostLikes(
    @GetUser('id', ParseIntPipe) uid: number,
    @Param('pid', ParseIntPipe) pid: number,
  ) {
    return this.postService.createPostLikes(pid, uid);
  }
}
