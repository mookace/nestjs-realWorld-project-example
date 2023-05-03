import {
  Ability,
  InferSubjects,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../user/user.entity';
import { ProfileEntity } from '../../profile/profile.entity';
import { BannerEntity } from '../../banner/banner.entity';
import { BrandEntity } from '../../brand/brand.entity';
import { CategoryEntity } from '../../category/category.entity';
import { CompanyEntity } from '../../company/company.entity';
import { EnquiryEntity } from '../../enquiry/enquiry.entity';
import { FavouriteEntity } from '../../favourite/favourite.entity';
import { HistoryEntity } from '../../history/history.entity';
import { OrderEntity } from '../../order/order.entity';
import { ProductEntity } from '../../product/product.entity';
import { ProductImageEntity } from '../../product-images/product-images.entity';
import { SettingEntity } from '../../settings/settings.entity';
import { BlogEntity } from '../../blog/blog.entity';
import { TicketEntity } from '../../ticket/ticket.entity';
import { FaqEntity } from '../../faq/faq.entity';
import { AttributesEntity } from '../../attributes/attributes.entity';
import { MailEntity } from '../../mail/mail.entity';
import { RatingEntity } from '../../rating/rating.entity';
import { ColourEntity } from '../../colour/colour.entity';
import { SizeEntity } from '../../size/size.entity';
import { OrderItemsEntity } from '../../order-items/order-items.entity';
import { MessageEntity } from '../../message/message.entity';
import { UnitEntity } from '../../unit/unit.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | InferSubjects<
      | typeof AttributesEntity
      | typeof BannerEntity
      | typeof BlogEntity
      | typeof BrandEntity
      | typeof CategoryEntity
      | typeof ColourEntity
      | typeof CompanyEntity
      | typeof EnquiryEntity
      | typeof FaqEntity
      | typeof FavouriteEntity
      | typeof HistoryEntity
      | typeof MailEntity
      | typeof MessageEntity
      | typeof OrderEntity
      | typeof OrderItemsEntity
      | typeof ProductEntity
      | typeof ProductImageEntity
      | typeof ProfileEntity
      | typeof RatingEntity
      | typeof SettingEntity
      | typeof SizeEntity
      | typeof TicketEntity
      | typeof UnitEntity
      | typeof UserEntity
    >
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: UserEntity) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>
    );

    //For Admin
    if (user.roles === 1) {
      can(Action.Manage, 'all');
    }

    //For user
    if (user.roles == 0) {
      console.log('enter customer action');
      can(Action.Read, AttributesEntity);
      can(Action.Read, BannerEntity);
      can(Action.Read, BlogEntity);
      can(Action.Read, BrandEntity);
      can(Action.Read, CategoryEntity);
      can(Action.Read, ColourEntity);
      can(Action.Read, CompanyEntity);
      can(Action.Manage, EnquiryEntity);
      can(Action.Manage, FaqEntity);
      can(Action.Manage, FavouriteEntity);
      can(Action.Manage, HistoryEntity);
      can(Action.Read, MessageEntity);
      can(Action.Manage, OrderEntity);

      can(Action.Manage, OrderItemsEntity);
      can(Action.Update, UserEntity);
    }

    //For vendor
    if (user.roles == 2) {
      console.log('enter vendor action');
      can(Action.Manage, AttributesEntity);
      can(Action.Manage, BannerEntity);
      can(Action.Manage, BlogEntity);
      can(Action.Manage, BrandEntity);
      can(Action.Manage, CategoryEntity);
      can(Action.Manage, ColourEntity);
      can(Action.Manage, CompanyEntity);
      can(Action.Manage, EnquiryEntity);
      can(Action.Manage, FaqEntity);
      can(Action.Manage, FavouriteEntity);
      can(Action.Manage, HistoryEntity);
      can(Action.Read, MessageEntity);
      can(Action.Manage, OrderEntity);

      can(Action.Manage, OrderItemsEntity);
      can(Action.Manage, ProductEntity);
      can(Action.Manage, ProductImageEntity);
      can(Action.Manage, SettingEntity);
      can(Action.Manage, SizeEntity);
      can(Action.Manage, TicketEntity);
      can(Action.Manage, UserEntity);
    }
    // can(Action.Update, UserEntity, { id: { $eq: user.id } });

    // can(Action.Update, 'all', { user: { $in: [user.slug, user.id] } });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
