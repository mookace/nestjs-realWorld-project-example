import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ColourService } from './colour.service';
import { ColourController } from './colour.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColourEntity } from './colour.entity';
import { ProductEntity } from '../product/product.entity';
import { SizeEntity } from '../size/size.entity';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([ColourEntity, ProductEntity, SizeEntity]),
    ProductModule,
    UserModule,
  ],
  controllers: [ColourController],
  providers: [ColourService],
  exports: [ColourService],
})
export class ColourModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'colour/create', method: RequestMethod.POST },
        { path: 'colour/delete', method: RequestMethod.POST }
      );
  }
}
