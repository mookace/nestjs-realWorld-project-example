import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from './ticket.entity';
import { HistoryEntity } from '../history/history.entity';
import { HistoryModule } from '../history/history.module';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketEntity, HistoryEntity]),
    UserModule,
    HistoryModule,
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'ticket/create', method: RequestMethod.POST },
        { path: 'ticket/all', method: RequestMethod.GET },
        { path: 'status/:code', method: RequestMethod.GET },
        { path: 'single/:id', method: RequestMethod.GET },
        { path: 'ticket/update', method: RequestMethod.POST },
        { path: 'ticket/update-id', method: RequestMethod.POST },
        { path: 'ticket/delete', method: RequestMethod.POST },
        { path: 'ticket/delete-id', method: RequestMethod.POST }
      );
  }
}
