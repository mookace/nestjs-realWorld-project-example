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
import { ProfileEntity } from '../profile/profile.entity';

@Entity('ticket')
export class TicketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column()
  user_id: number;

  @ManyToOne(() => ProfileEntity, (item) => item.ticket, {
    eager: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  profile: ProfileEntity;

  @Column({ type: 'text', nullable: true })
  body: string;

  //0=pending,1=done by admin,2=completed
  @Column({ default: 0 })
  status: number;

  @Column({ default: 0 })
  priority: number;

  @OneToOne(() => HistoryEntity, (item) => item.ticket)
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
