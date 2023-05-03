import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributesEntity } from './attributes.entity';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([AttributesEntity]), UserModule],
  controllers: [AttributesController],
  providers: [AttributesService],
})
export class AttributesModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'attributes/create', method: RequestMethod.POST },
        { path: 'attributes/user', method: RequestMethod.GET },
        { path: 'attributes/update', method: RequestMethod.POST },
        { path: 'attributes/delete', method: RequestMethod.POST }
      );
  }
}
