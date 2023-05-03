import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from './region.entity';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([RegionEntity]), UserModule],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'region/create', method: RequestMethod.POST },
        { path: 'region/imageurl', method: RequestMethod.POST },
        { path: 'region/update-id', method: RequestMethod.POST },
        { path: 'region/delete-id', method: RequestMethod.POST }
      );
  }
}
