import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HistoryEntity } from '../history/history.entity';
import { ProductEntity } from '../product/product.entity';
import { OrderEntity } from '../order/order.entity';

@Entity('order_items')
export class OrderItemsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column()
  user_id: number;

  @Column()
  order_id: number;

  @ManyToOne(() => OrderEntity, (item) => item.order_item)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({ type: 'text', nullable: true })
  product: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  price: number;

  @ManyToOne(() => ProductEntity, (item) => item.order_item, { eager: true })
  product_id: ProductEntity;

  // 0=Received,1=Accepted,2=InProgress,3=ReadyToDelivery,4=Completed,5=Rejected
  @Column({ default: 0 })
  status: number;

  @Column({ default: 0 })
  sales: number;

  @Column({ default: 0 })
  cancel: number;

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
  size_var: object;

  //where 0=single product,1=wholesale product
  @Column({ default: 0 })
  sale_type: number;

  @OneToOne(() => HistoryEntity, (his) => his.order_item)
  history: HistoryEntity;

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
