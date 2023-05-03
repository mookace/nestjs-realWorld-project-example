import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitEntity } from './unit.entity';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([UnitEntity]), UserModule],
  controllers: [UnitController],
  providers: [UnitService],
})
export class UnitModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'unit/create', method: RequestMethod.POST },
        { path: 'unit/user', method: RequestMethod.GET },
        { path: 'unit/update', method: RequestMethod.POST },
        { path: 'unit/delete', method: RequestMethod.POST }
      );
  }
}
