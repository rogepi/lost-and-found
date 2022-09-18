import { Item } from './../../item/entities/item.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hashSync } from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 100, default: '' })
  username: string;

  @Column({ length: 100, default: '' })
  nickname: string;

  @Column({ default: '男' })
  sex: '男' | '女';

  @Column({ length: 20, default: '' })
  phone: string;

  // @Exclude()
  @Column({ default: '' })
  password: string;

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    default:
      'http://localhost:9080/static/uploads/static/3ea6beec64369c2642b92c6726f1epng.png',
  })
  avatarPath: string;

  @Column()
  question: string;

  @Column()
  answer: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @OneToMany((type) => Item, (item) => item.user)
  items: Item[];

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert()
  async encryptPwd() {
    this.password = await hashSync(this.password);
  }
}
