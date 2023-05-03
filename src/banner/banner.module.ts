import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity } from './banner.entity';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity]), UserModule],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'banner/user', method: RequestMethod.GET },
        { path: 'banner/create', method: RequestMethod.POST },
        { path: 'banner/update', method: RequestMethod.POST },
        { path: 'banner/delete', method: RequestMethod.POST }
      );
  }
}
