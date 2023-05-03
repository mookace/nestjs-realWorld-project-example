import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SizeService } from './size.service';
import { SizeController } from './size.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeEntity } from './size.entity';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserModule } from '../user/user.module';
import { ColourEntity } from '../colour/colour.entity';
import { ProductEntity } from '../product/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SizeEntity, ColourEntity, ProductEntity]),
    UserModule,
  ],
  controllers: [SizeController],
  providers: [SizeService],
})
export class SizeModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'size/create', method: RequestMethod.POST },
        { path: 'size/update', method: RequestMethod.POST },
        { path: 'size/delete', method: RequestMethod.POST }
      );
  }
}
