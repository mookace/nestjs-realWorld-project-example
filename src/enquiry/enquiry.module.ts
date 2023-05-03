import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { EnquiryController } from './enquiry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnquiryEntity } from './enquiry.entity';
import { UserEntity } from '../user/user.entity';
import { ProductEntity } from '../product/product.entity';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnquiryEntity, UserEntity, ProductEntity]),
    UserModule,
    MailModule,
  ],
  controllers: [EnquiryController],
  providers: [EnquiryService],
})
export class EnquiryModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'enquiry/create', method: RequestMethod.POST },
        { path: 'enquiry/reply', method: RequestMethod.POST },
        { path: 'enquiry/all', method: RequestMethod.GET },
        { path: 'enquiry/update', method: RequestMethod.POST },
        { path: 'enquiry/update-id', method: RequestMethod.POST },
        { path: 'enquiry/delete', method: RequestMethod.POST },
        { path: 'enquiry/delete-id', method: RequestMethod.POST }
      );
  }
}
