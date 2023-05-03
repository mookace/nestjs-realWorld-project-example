import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemsEntity } from './order-items.entity';
import { AuthMiddleware } from '../user/auth.middleware';
import { OrderEntity } from '../order/order.entity';
import { UserEntity } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { AbilityModule } from '../ability/ability.module';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItemsEntity, OrderEntity, UserEntity]),
    UserModule,
    AbilityModule,
  ],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports: [OrderItemsService],
})
export class OrderItemsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'order-item/all', method: RequestMethod.GET },
        { path: 'order-item/pending', method: RequestMethod.GET },
        { path: 'order-item/delivered', method: RequestMethod.GET },
        { path: 'order-item/total', method: RequestMethod.POST },
        { path: 'order-item/total-sales', method: RequestMethod.POST },
        { path: 'order-item/total-cancel', method: RequestMethod.POST },
        { path: 'order-item/sales', method: RequestMethod.GET },
        { path: 'order-item/cancel', method: RequestMethod.GET },
        { path: 'order-item/vendor/:order', method: RequestMethod.GET },
        { path: 'order-item/cancel-order/:id', method: RequestMethod.POST },
        { path: 'order-item/my-order', method: RequestMethod.GET },
        { path: 'order-item/order/:id', method: RequestMethod.GET },
        { path: 'order-item/update', method: RequestMethod.POST },
        { path: 'order-item/update-id', method: RequestMethod.POST },
        { path: 'order-item/delete', method: RequestMethod.POST },
        { path: 'order-item/delete-id', method: RequestMethod.POST }
      );
  }
}
