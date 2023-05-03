import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from '../product/product.entity';

@Entity('company')
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column()
  user_id: number;

  @Column({ unique: true })
  user: number;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  ceo_name: string;

  @Column({ type: 'text', nullable: true })
  logo: string;

  //year of establishment
  @Column({ type: 'text', nullable: true })
  year: string;

  //legal status of firm
  @Column({ type: 'text', nullable: true })
  legal_status: string;

  //nature of bussiness
  @Column({ type: 'text', nullable: true })
  nature: string;

  //   number of employee
  @Column({ type: 'text', nullable: true })
  employee: string;

  //annual turnover
  @Column({ type: 'text', nullable: true })
  annual_turnover: string;

  //member since
  @Column({ type: 'text', nullable: true })
  member_since: string;

  //   import export code
  @Column({ type: 'text', nullable: true })
  IEC_code: string;

  //exports to
  @Column({ type: 'text', nullable: true })
  exports_to: string;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  fb_url: string;

  @Column({ type: 'text', nullable: true })
  gmail_url: string;

  @Column({ type: 'text', nullable: true })
  insta_url: string;

  @Column({ type: 'text', nullable: true })
  web_url: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  GSTIN: string;

  @Column({ type: 'text', nullable: true })
  TAN: string;

  @Column({ type: 'text', nullable: true })
  PAN: string;

  @Column({ type: 'text', nullable: true })
  CIN_LLPIN: string;

  @Column({ default: 0 })
  status: number;

  @OneToMany(() => ProductEntity, (item) => item.company)
  product: ProductEntity;

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
