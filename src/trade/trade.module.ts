import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeEntity } from './trade.entity';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([TradeEntity]), UserModule],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'trade/create', method: RequestMethod.POST },
        { path: 'trade/imageurl', method: RequestMethod.POST },
        { path: 'trade/update-id', method: RequestMethod.POST },
        { path: 'trade/delete-id', method: RequestMethod.POST }
      );
  }
}
