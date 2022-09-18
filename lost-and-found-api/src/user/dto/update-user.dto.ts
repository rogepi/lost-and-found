import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: '账户名' })
  readonly username: string;

  @ApiProperty({ description: '姓名' })
  readonly nickname: string;

  @ApiProperty({ description: '性别' })
  readonly sex: '男' | '女';

  @ApiProperty({ description: '电话' })
  readonly phone: string;

  @ApiProperty({ description: '头像' })
  avatarPath: string;

  @ApiProperty({ description: '密保问题' })
  readonly question: string;

  @ApiProperty({ description: '答案' })
  readonly answer: string;
}
