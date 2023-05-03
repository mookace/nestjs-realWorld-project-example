import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqEntity } from './faq.entity';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([FaqEntity]), UserModule],
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'faq/create-qsn', method: RequestMethod.POST },
        { path: 'faq/create-ans', method: RequestMethod.POST },
        { path: 'faq/update', method: RequestMethod.POST },
        { path: 'faq/delete', method: RequestMethod.POST }
      );
  }
}
