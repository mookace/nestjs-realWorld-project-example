import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import moment = require('moment');
import { ProfileEntity } from '../profile/profile.entity';
import { HistoryEntity } from '../history/history.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => ProfileEntity, (item) => item.message_user, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  profile_user: ProfileEntity;

  @Column({ type: 'text', nullable: true })
  msg: string;

  @Column({ nullable: true })
  vendor_id: number;

  @ManyToOne(() => ProfileEntity, (item) => item.message_vendor, {
    eager: true,
  })
  @JoinColumn({ name: 'vendor_id', referencedColumnName: 'user_id' })
  profile_vendor: ProfileEntity;

  @Column({ default: 0, nullable: true })
  status: number;

  @CreateDateColumn({
    nullable: true,
    transformer: {
      to(value) {
        return new Date();
      },

      from(value) {
        if (value) {
          return moment(value).fromNow();
        }
      },
    },
  })
  created_at: Date;

  @OneToOne(() => HistoryEntity, (item) => item.chat)
  history: HistoryEntity;

  @Column({ nullable: true })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
