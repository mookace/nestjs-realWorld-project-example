import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from '../product/product.entity';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column()
  user_id: number;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ type: 'text', nullable: true })
  short_description: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  //0=not popular,1=popular
  @Column({ default: 0 })
  is_popular: number;

  //is for showing selected categories in homepage
  @Column({ default: 0 })
  is_cat_display_hmpg: number;

  //is for showing selected categories in homepage
  @Column({ default: 0 })
  is_subcat_display_hmpg: number;

  // 0=cat , 1=sub-cat , 2=sub-sub-cat
  @Column({ default: 0 })
  status: number;

  @Column({ nullable: true })
  parentId: number;

  @Column({ nullable: true })
  childCategoryId: number;

  @OneToMany(() => ProductEntity, (item) => item.cat)
  product: ProductEntity[];

  @OneToMany(() => ProductEntity, (item) => item.sub_cat)
  sub_product: ProductEntity[];

  @OneToMany(() => ProductEntity, (item) => item.sub_sub_cat)
  sub_sub_product: ProductEntity[];

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
