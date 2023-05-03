import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';
import { MessageController } from './message.controller';
import { HistoryEntity } from '../history/history.entity';
import { UserEntity } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, HistoryEntity, UserEntity]),
    UserModule,
  ],
  controllers: [MessageController],
  providers: [MessageGateway, MessageService],
})
export class MessageModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'message/all', method: RequestMethod.POST },
        { path: 'message/all-user-msg', method: RequestMethod.POST }
      );
  }
}
