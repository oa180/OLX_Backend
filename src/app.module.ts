import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
// import { ProductModule } from './product/product.module';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { OrderModule } from './order/order.module';
import { FavListModule } from './fav-list/fav-list.module';
import { CategoryModule } from './category/category.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guard/roles.guard';
import { FeedModule } from './feed/feed.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    PrismaModule,
    // ProductModule,
    PostModule,
    OrderModule,
    FavListModule,
    CategoryModule,
    FeedModule,

    EmailModule,
  ],
  providers: [],
  // providers: [{ provide: APP_GUARD, useClass: RolesGuard }],
  // controllers: [PostController],
})
export class AppModule {}
