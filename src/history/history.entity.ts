import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from '../order/order.entity';
import { FavouriteEntity } from '../favourite/favourite.entity';
import { TicketEntity } from '../ticket/ticket.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { OrderItemsEntity } from '../order-items/order-items.entity';
import { MessageEntity } from '../message/message.entity';

@Entity('history')
export class HistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column()
  user_id: number;

  @Column({ type: 'text', nullable: true })
  message: string;

  @ManyToOne(() => ProfileEntity, (item) => item.history, { eager: true })
  @JoinColumn({ name: 'user', referencedColumnName: 'user_id' })
  profile: ProfileEntity;

  @OneToOne(() => OrderEntity, (order) => order.history, { eager: true })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @OneToOne(() => OrderItemsEntity, (item) => item.history, { eager: true })
  @JoinColumn({ name: 'order_item_id' })
  order_item: OrderItemsEntity;

  @OneToOne(() => FavouriteEntity, (fav) => fav.history, { eager: true })
  @JoinColumn({ name: 'fav_id' })
  fav: FavouriteEntity;

  @OneToOne(() => TicketEntity, (item) => item.history, { eager: true })
  @JoinColumn({ name: 'ticket_id' })
  ticket: TicketEntity;

  @OneToOne(() => MessageEntity, (item) => item.history, { eager: true })
  @JoinColumn({ name: 'chat_id' })
  chat: MessageEntity;

  @Column({ default: 0 })
  status: number;

  //0=already read,1=unread notification
  @Column({ default: 0 })
  notify: number;

  @Column({ default: false })
  notify_deleted: boolean;

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
