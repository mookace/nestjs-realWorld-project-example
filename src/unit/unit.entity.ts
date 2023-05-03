import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('unit')
export class UnitEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column()
  user_id: number;

  @Column({ type: 'text', nullable: true })
  name: string;

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
