import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SizeEntity } from '../size/size.entity';

@Entity('colour')
export class ColourEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column()
  user_id: number;

  @Column({ type: 'text', nullable: true })
  colour: string;

  @Column({ type: 'int', nullable: true })
  quantity: number;

  @Column({ nullable: true })
  price: number;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ type: 'boolean', default: false })
  is_image_main: boolean;

  @Column({ nullable: true })
  product_id: number;

  @OneToMany((type) => SizeEntity, (item) => item.colour)
  size: SizeEntity[];

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
