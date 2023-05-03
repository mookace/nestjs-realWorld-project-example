import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from '../product/product.entity';
import { UserEntity } from '../user/user.entity';

@Entity('enquiry')
export class EnquiryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  slug: string;

  @ManyToOne(() => UserEntity, (item) => item.enquiry, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;

  @Column({ nullable: true })
  parent_id: number;

  @Column({ nullable: true })
  vendor: number;

  @Column({ type: 'text', nullable: true })
  sender_email: string;

  @Column({ type: 'text', nullable: true })
  receiver_email: string;

  @ManyToOne(() => ProductEntity, (item) => item.enquiry, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product_id: ProductEntity;

  @Column({ nullable: true })
  qty: number;

  @Column({ type: 'text', nullable: true })
  code: string;

  @Column({ nullable: true, default: 0 })
  receiver_status: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @Column({ default: 0 })
  send_reply_status: number;

  @Column({ default: 0 })
  status: number;

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
