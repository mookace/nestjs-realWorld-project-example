import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryEntity } from './history.entity';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryEntity]), UserModule],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'history/all-notify', method: RequestMethod.GET },
        { path: 'history/unread-notify', method: RequestMethod.GET },
        { path: 'history/read/:id', method: RequestMethod.POST },
        { path: 'history/notify-delete/:id', method: RequestMethod.POST },
        { path: 'history/notify-delete-all', method: RequestMethod.POST },
        { path: 'history/read-all', method: RequestMethod.POST },
        { path: 'history/my-history', method: RequestMethod.GET },
        { path: 'history/status/:id', method: RequestMethod.POST },
        { path: 'history/delete', method: RequestMethod.POST }
      );
  }
}
