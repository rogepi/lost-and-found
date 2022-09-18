import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '账户名不能为空' })
  @ApiProperty({ description: '账户名' })
  readonly username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @ApiProperty({ description: '密码' })
  readonly password: string;
}
