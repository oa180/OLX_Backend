import { Module } from '@nestjs/common';
import { FavListController } from './fav-list.controller';
import { FavListService } from './fav-list.service';

@Module({
  controllers: [FavListController],
  providers: [FavListService]
})
export class FavListModule {}
