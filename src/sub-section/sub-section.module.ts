import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SubSectionService } from './sub-section.service';
import { SubSectionController } from './sub-section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubSectionEntity } from './sub-section.entity';
import { UserModule } from '../user/user.module';
import { SectionEntity } from '../section/section.entity';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubSectionEntity, SectionEntity]),
    UserModule,
  ],
  controllers: [SubSectionController],
  providers: [SubSectionService],
})
export class SubSectionModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'sub-section/create', method: RequestMethod.POST },
        { path: 'sub-section/imageurl', method: RequestMethod.POST },
        { path: 'sub-section/update-id', method: RequestMethod.POST },
        { path: 'sub-section/delete-id', method: RequestMethod.POST }
      );
  }
}
