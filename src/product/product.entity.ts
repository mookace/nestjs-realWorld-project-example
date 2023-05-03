import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../category/category.entity';
import { ProductImageEntity } from '../product-images/product-images.entity';
import { BrandEntity } from '../brand/brand.entity';
import { FavouriteEntity } from '../favourite/favourite.entity';
import { RatingEntity } from '../rating/rating.entity';
import { CompanyEntity } from '../company/company.entity';
import { OrderItemsEntity } from '../order-items/order-items.entity';
import { EnquiryEntity } from '../enquiry/enquiry.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column()
  user_id: number;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  unit: string;

  @OneToMany(() => EnquiryEntity, (item) => item.product_id)
  enquiry: EnquiryEntity;

  @Column({ type: 'text', nullable: true })
  location: string;

  @ManyToOne(() => CompanyEntity, (item) => item.product, { eager: true })
  @JoinColumn({ name: 'vendor', referencedColumnName: 'user' })
  company: CompanyEntity;

  @Column({ type: 'text', nullable: true })
  model_no: string;

  @Column({ type: 'text', nullable: true })
  gaurantee: string;

  @Column({ type: 'text', nullable: true })
  delivery_time: string;

  @Column({ type: 'text', nullable: true })
  size_available: string;

  @Column({ type: 'text', nullable: true })
  colour_available: string;

  @Column({ nullable: true, default: 0 })
  colour: number;

  @Column({ type: 'text', nullable: true })
  min_order: string;

  @Column({ type: 'text', nullable: true })
  sub_unit: string;

  @Column({ type: 'text', nullable: true })
  per_unit_qty: string;

  //Number of product
  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  price: number;

  //where 0=single product,1=wholesale product
  @Column({ default: 0 })
  sale_type: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  status: number;

  //Adding some column
  @Column({ type: 'text', nullable: true })
  min_price: string;

  @Column({ type: 'text', nullable: true })
  max_price: string;

  @Column({ nullable: true })
  wholesale_price_type: number;

  @Column({ type: 'text', nullable: true })
  production_capacity: string;

  @Column({ type: 'text', nullable: true })
  product_service_code: string;

  @Column({ type: 'text', nullable: true })
  wholesale_image: string;

  //upto here

  //change incoming object into string
  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      from(val: string) {
        return JSON.parse(val);
      },
      to(val: object) {
        return JSON.stringify(val);
      },
    },
  })
  attributes: object;

  //change incoming object into string
  @Column({
    nullable: true,
    type: 'text',
    transformer: {
      from(val: string) {
        return JSON.parse(val);
      },
      to(val: object) {
        return JSON.stringify(val);
      },
    },
  })
  features: object;

  //change incoming object into string
  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      from(val: string) {
        return JSON.parse(val);
      },
      to(val: object) {
        return JSON.stringify(val);
      },
    },
  })
  specification: object;

  // All Relation tables

  @OneToMany(() => FavouriteEntity, (fav) => fav.product)
  favourite: FavouriteEntity[];

  @ManyToOne(() => BrandEntity, { eager: true, cascade: true })
  @JoinColumn()
  brand: BrandEntity;

  @OneToMany(() => ProductImageEntity, (images) => images.product, {
    eager: true,
  })
  @JoinColumn({ name: 'product_images' })
  product_images: ProductImageEntity[];

  @Column({ type: 'text', nullable: true })
  main_image: string;

  @ManyToOne(() => CategoryEntity, (category) => category.product, {
    eager: true,
  })
  @JoinColumn()
  cat: CategoryEntity;

  @ManyToOne(() => CategoryEntity, (cat) => cat.sub_product, {
    eager: true,
  })
  @JoinColumn()
  sub_cat: CategoryEntity;

  @ManyToOne(() => CategoryEntity, (cat) => cat.sub_sub_product, {
    eager: true,
  })
  @JoinColumn()
  sub_sub_cat: CategoryEntity;

  @OneToMany(() => OrderItemsEntity, (order) => order.product_id)
  order_item: OrderItemsEntity[];

  @OneToMany(() => RatingEntity, (item) => item.product, { eager: true })
  rating: RatingEntity[];

  @CreateDateColumn({
    transformer: {
      from(value) {
        if (value) {
          return value.toISOString().split('T')[0];
        }
      },
      to(value) {
        return value;
      },
    },
  })
  created_at: Date;

  @Column({ nullable: true })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
