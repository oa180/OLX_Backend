import {
  Controller,
  UseGuards,
  Param,
  Get,
  Post,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtGuard } from 'src/guard/jwt.guard';
import { FavListService } from './fav-list.service';

@UseGuards(JwtGuard)
@Controller('favlist')
export class FavListController {
  constructor(private favListService: FavListService) {}

  @Get()
  getUserFavList(@GetUser('id') uid: number) {
    return this.favListService.getUserFavList(uid);
  }

  @Post(':pid')
  addPostToFavList(
    @GetUser('id') uid: number,
    @Param('pid', ParseIntPipe) pid: number,
  ) {
    return this.favListService.addPostToFavList(uid, pid);
  }

  @Delete(':pid')
  deletePostFromFavList(
    @GetUser('id') uid: number,
    @Param('pid', ParseIntPipe) pid: number,
  ) {
    return this.favListService.deletePostFromFavList(uid, pid);
  }
}
