import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingEntity } from './settings.entity';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from '../user/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity]), UserModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'settings/create', method: RequestMethod.POST },
        { path: 'settings/update', method: RequestMethod.POST },
        { path: 'settings/delete', method: RequestMethod.POST }
      );
  }
}
