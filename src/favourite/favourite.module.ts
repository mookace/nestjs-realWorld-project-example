import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavouriteEntity } from './favourite.entity';
import { ProductEntity } from '../product/product.entity';
import { HistoryEntity } from '../history/history.entity';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavouriteEntity, ProductEntity, HistoryEntity]),
    UserModule,
  ],
  controllers: [FavouriteController],
  providers: [FavouriteService],
})
export class FavouriteModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'favourite/create', method: RequestMethod.POST },
        { path: 'favourite/my-fav', method: RequestMethod.GET },
        { path: 'favourite/delete', method: RequestMethod.POST }
      );
  }
}
