import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionEntity } from './section.entity';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([SectionEntity]), UserModule],
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'section/create', method: RequestMethod.POST },
        { path: 'section/imageurl', method: RequestMethod.POST },
        { path: 'section/update-id', method: RequestMethod.POST },
        { path: 'section/delete-id', method: RequestMethod.POST }
      );
  }
}
