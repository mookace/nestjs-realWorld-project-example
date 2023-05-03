import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HistoryEntity } from '../history/history.entity';
import { OrderItemsEntity } from '../order-items/order-items.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column()
  user_id: number;

  @Column({ type: 'text', nullable: true })
  user_email: string;

  @Column({ type: 'text', nullable: true })
  order_id_code: string;

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
  billing: object;

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
  shipping: object;

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
  customer_info: object;

  @Column()
  total_price: number;

  // 0=Received,1=Accepted,2=InProgress,3=ReadyToDelivery,4=Completed,5=Rejected
  @Column({ type: 'enum', enum: [0, 1, 2, 3, 4, 5], default: 0 })
  status: number;

  @Column({ default: 0 })
  sales: number;

  @Column({ default: 0 })
  cancel: number;

  @OneToMany(() => OrderItemsEntity, (item) => item.order, { eager: true })
  order_item: OrderItemsEntity[];

  //0=billing,1=shipping
  @Column({ default: 0 })
  type: number;

  @OneToOne(() => HistoryEntity, (his) => his.order)
  history: HistoryEntity;

  @Column({ nullable: true })
  timestamp: Date;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
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

  // public orderStatus() {
  //   return [
  //     { value: '0', label: 'Received', id: '' },
  //     { value: '1', label: 'Accepted', id: '' },
  //     { value: '2', label: 'InProgress', id: '' },
  //     { value: '3', label: 'ReadyToDelivery', id: '' },
  //     { value: '4', label: 'Completed', id: '' },
  //     { value: '5', label: 'Rejected', id: '' },
  //   ];
  // }
}
