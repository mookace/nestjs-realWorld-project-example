import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), UserModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'category/user-category', method: RequestMethod.GET },
        { path: 'category/popular-category', method: RequestMethod.POST },
        { path: 'category/create', method: RequestMethod.POST },
        { path: 'category/update', method: RequestMethod.POST },
        { path: 'category/delete', method: RequestMethod.POST },
        { path: 'category/imageurl', method: RequestMethod.POST }
      );
  }
}
