import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class ValidateUserDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, default: '' })
  username: string;

  @Column({ length: 100, default: '' })
  nickname: string;

  @Column({ default: '男' })
  sex: '男' | '女';

  @Column({ length: 20, default: '' })
  phone: string;

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
}
