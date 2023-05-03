import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './company.entity';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity]), UserModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'company/all', method: RequestMethod.GET },
        { path: 'company/own', method: RequestMethod.GET },
        { path: 'company/update', method: RequestMethod.POST },
        { path: 'company/update-own', method: RequestMethod.POST },
        { path: 'company/delete', method: RequestMethod.POST }
      );
  }
}
