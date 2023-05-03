import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserEntity } from '../user/user.entity';
import { OrderItemsEntity } from '../order-items/order-items.entity';
import { SizeEntity } from '../size/size.entity';
import { HistoryEntity } from '../history/history.entity';
import { UserModule } from '../user/user.module';
import { HistoryModule } from '../history/history.module';
import { AbilityModule } from '../ability/ability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      UserEntity,
      OrderItemsEntity,
      SizeEntity,
      HistoryEntity,
    ]),
    UserModule,
    HistoryModule,
    AbilityModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'order/all', method: RequestMethod.GET },
        { path: 'order/total-orders-date', method: RequestMethod.POST },
        { path: 'order/total-sales-date', method: RequestMethod.POST },
        { path: 'order/total-cancel-date', method: RequestMethod.POST },
        { path: 'order/total-orders', method: RequestMethod.GET },
        { path: 'order/total-sales', method: RequestMethod.GET },
        { path: 'order/total-cancel', method: RequestMethod.GET },
        { path: 'order/all-order', method: RequestMethod.GET },
        { path: 'order/four-months', method: RequestMethod.GET },
        { path: 'order/latest', method: RequestMethod.GET },
        { path: 'order/my-order', method: RequestMethod.GET },
        { path: 'order/today', method: RequestMethod.GET },
        { path: 'order/total-today', method: RequestMethod.GET },
        { path: 'order/single/:id', method: RequestMethod.GET },
        { path: 'order/create', method: RequestMethod.POST },
        { path: 'order/change-status', method: RequestMethod.POST },
        { path: 'order/delete-id', method: RequestMethod.POST }
      );
  }
}
