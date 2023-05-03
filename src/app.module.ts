import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { UnitModule } from './unit/unit.module';
import { AttributesModule } from './attributes/attributes.module';
import { BannerModule } from './banner/banner.module';
import { BlogModule } from './blog/blog.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ColourModule } from './colour/colour.module';
import { CompanyModule } from './company/company.module';
import { EnquiryModule } from './enquiry/enquiry.module';
import { FaqModule } from './faq/faq.module';
import { FavouriteModule } from './favourite/favourite.module';
import { HistoryModule } from './history/history.module';
import { MailModule } from './mail/mail.module';
import { OrderModule } from './order/order.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { ProductModule } from './product/product.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { ProfileModule } from './profile/profile.module';
import { RatingModule } from './rating/rating.module';
import { SettingsModule } from './settings/settings.module';
import { SizeModule } from './size/size.module';
import { TicketModule } from './ticket/ticket.module';
import { MessageModule } from './message/message.module';
import { RegionModule } from './region/region.module';
import { SectionModule } from './section/section.module';
import { SubSectionModule } from './sub-section/sub-section.module';
import { TradeModule } from './trade/trade.module';
import { AbilityModule } from './ability/ability.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_host,
      port: 5432,
      username: process.env.DB_username,
      password: process.env.DB_password,
      database: process.env.DB_database,
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    UnitModule,
    AttributesModule,
    BannerModule,
    BlogModule,
    BrandModule,
    CategoryModule,
    ColourModule,
    CompanyModule,
    EnquiryModule,
    FaqModule,
    FavouriteModule,
    HistoryModule,
    MailModule,
    OrderModule,
    OrderItemsModule,
    ProductModule,
    ProductImagesModule,
    ProfileModule,
    RatingModule,
    SettingsModule,
    SizeModule,
    TicketModule,
    MessageModule,
    RegionModule,
    TradeModule,
    SectionModule,
    SubSectionModule,
    AbilityModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class ApplicationModule {}
