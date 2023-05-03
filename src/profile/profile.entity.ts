import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { HistoryEntity } from '../history/history.entity';
import { TicketEntity } from '../ticket/ticket.entity';
import { MessageEntity } from '../message/message.entity';

@Entity('profile')
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ unique: true })
  user_id: number;

  @Column({ type: 'text', unique: true })
  user_slug: string;

  @Column({ type: 'text', nullable: true })
  username: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  //0=customer,1=admin,2=vendor
  @Column({ default: 0 })
  roles: number;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ type: 'text', nullable: true })
  firstName: string;

  @Column({ type: 'text', nullable: true })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ type: 'text', nullable: true })
  date_of_birth: string;

  @Column({ type: 'text', nullable: true })
  gender: string;

  @Column({ type: 'text', nullable: true })
  city: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  designation: string;

  @Column({ type: 'text', nullable: true })
  company: string;

  @Column({ default: 'Nepal' })
  country: string;

  @OneToOne(() => UserEntity, (item) => item.profile)
  user: UserEntity;

  @OneToMany(() => HistoryEntity, (item) => item.profile)
  history: HistoryEntity;

  @OneToMany(() => MessageEntity, (item) => item.profile_user)
  message_user: MessageEntity;

  @OneToMany(() => MessageEntity, (item) => item.profile_vendor)
  message_vendor: MessageEntity;

  @OneToMany(() => TicketEntity, (item) => item.profile)
  ticket: TicketEntity;

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
