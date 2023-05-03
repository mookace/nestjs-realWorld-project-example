import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import * as argon2 from 'argon2';
import { ProfileEntity } from '../profile/profile.entity';
import { CompanyEntity } from '../company/company.entity';
import { EnquiryEntity } from '../enquiry/enquiry.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ nullable: true })
  vendor_id: number;

  // 0=free ,1=premium,2=gold product
  @Column({ nullable: true })
  service: number;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'text', nullable: true })
  pass_code: string;

  //0=customer,1=admin,2=vendor
  @Column({ default: 0 })
  roles: number;

  @Column({ default: 0 })
  status: number;

  //0=inactive vendor,1=active vendor,2=delete vendor
  @Column({ default: 0 })
  is_active: number;

  // 0=offline,1=Online
  @Column({ default: 0 })
  is_logged: number;

  @Column({ type: 'text', nullable: true })
  token: string;

  @OneToOne(() => ProfileEntity, (item) => item.user, { eager: true })
  @JoinColumn({ name: 'profile' })
  profile: ProfileEntity;

  @OneToOne(() => CompanyEntity, (item) => item.user, { eager: true })
  @JoinColumn({ name: 'company' })
  company: CompanyEntity;

  @OneToMany(() => EnquiryEntity, (item) => item.user_id)
  enquiry: EnquiryEntity;

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @BeforeInsert()
  async emailToLowercase() {
    this.email = await this.email.trim();
    this.email = await this.email.toLowerCase();
  }
}
