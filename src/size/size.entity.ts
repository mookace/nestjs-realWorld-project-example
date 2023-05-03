import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColourEntity } from '../colour/colour.entity';

@Entity('size')
export class SizeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  regular_price: number;

  // 0=No,1=yes
  @Column({ nullable: true })
  discount_status: number;

  @Column({ nullable: true })
  discount: number;

  //0=percent,1=price
  @Column({ nullable: true })
  discount_type: number;

  @Column({ type: 'text', nullable: true })
  size: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  product_id: number;

  @ManyToOne(() => ColourEntity, (item) => item.size, {
    nullable: true,
  })
  colour: ColourEntity;

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
