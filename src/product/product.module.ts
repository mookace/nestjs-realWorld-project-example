import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { UserModule } from '../user/user.module';
import { ProductImageEntity } from '../product-images/product-images.entity';
import { UserEntity } from '../user/user.entity';
import { CompanyEntity } from '../company/company.entity';
import { ColourEntity } from '../colour/colour.entity';
import { SizeEntity } from '../size/size.entity';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductImageEntity,
      UserEntity,
      CompanyEntity,
      ColourEntity,
      SizeEntity,
    ]),
    UserModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'product/create', method: RequestMethod.POST },
      {
        path: 'product/create-image/:product_slug',
        method: RequestMethod.POST,
      },
      {
        path: 'product/create-image-product/:id',
        method: RequestMethod.POST,
      },
      { path: 'product/delete-image', method: RequestMethod.POST },
      { path: 'product/update', method: RequestMethod.POST },
      { path: 'product/updatebyId/:id', method: RequestMethod.POST },
      { path: 'product/update-id', method: RequestMethod.POST },
      { path: 'product/delete-id', method: RequestMethod.POST },
      { path: 'product/total-product', method: RequestMethod.GET }
    );
  }
}
