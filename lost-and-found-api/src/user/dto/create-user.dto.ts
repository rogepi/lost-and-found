import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: '账户名不能为空' })
  @ApiProperty({ description: '账户名' })
  readonly username: string;

  @IsNotEmpty({ message: '姓名不能为空' })
  @ApiProperty({ description: '姓名' })
  readonly nickname: string;

  @ApiProperty({ description: '性别' })
  readonly sex: '男' | '女';

  @ApiProperty({ description: '电话' })
  readonly phone: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @ApiProperty({ description: '密码' })
  readonly password: string;

  @IsNotEmpty({ message: '密保问题不能为空' })
  @ApiProperty({ description: '密保问题' })
  readonly question: string;

  @IsNotEmpty({ message: '答案不能为空' })
  @ApiProperty({ description: '答案' })
  readonly answer: string;
}
