import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity('item')
export class Item {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column()
  place: string;

  @Column()
  time: Date;

  @Column()
  contact: string;

  @Column()
  description: string;

  @Column({ default: '未领取' })
  state: string;

  @Column()
  photoPath: string;

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @ManyToOne((type) => User, (user) => user.items)
  user: User;

  @OneToMany((type) => Comment, (comment) => comment.item)
  comments: Comment[];
}
