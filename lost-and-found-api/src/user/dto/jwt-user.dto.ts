import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class JwtUserDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, default: '' })
  username: string;
}
