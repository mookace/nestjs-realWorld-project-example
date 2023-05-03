import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AdminController } from './admin.controller';
import { MailModule } from '../mail/mail.module';
import { ProfileEntity } from '../profile/profile.entity';
import { CompanyEntity } from '../company/company.entity';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProfileEntity, CompanyEntity]),
    MailModule,
  ],
  controllers: [UserController, AdminController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      //user
      { path: 'user/change-password', method: RequestMethod.POST },
      { path: 'user/reset-password', method: RequestMethod.POST },
      { path: 'user/logout', method: RequestMethod.POST },

      //vendor
      { path: 'admin/vendor/users', method: RequestMethod.GET },
      { path: 'admin/vendor/create-user', method: RequestMethod.POST },
      { path: 'admin/roles', method: RequestMethod.POST },

      //admin
      { path: 'admin/all', method: RequestMethod.GET },
      { path: 'admin/total-users', method: RequestMethod.GET },
      { path: 'admin/users-only', method: RequestMethod.GET },
      { path: 'admin/new-users-today', method: RequestMethod.GET },
      { path: 'admin/total-vendor', method: RequestMethod.GET },
      { path: 'admin/all-vendor', method: RequestMethod.GET },
      { path: 'admin/activate', method: RequestMethod.POST },
      { path: 'admin/delete-vendor', method: RequestMethod.POST },
      { path: 'admin/delete', method: RequestMethod.POST }
    );
  }
}
