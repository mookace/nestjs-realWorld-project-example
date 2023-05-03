import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandEntity } from './brand.entity';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity]), UserModule],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'brand/create', method: RequestMethod.POST },
        { path: 'brand/user', method: RequestMethod.GET },
        { path: 'brand/update', method: RequestMethod.POST },
        { path: 'brand/delete', method: RequestMethod.POST },
        { path: 'brand/imageurl', method: RequestMethod.POST }
      );
  }
}
