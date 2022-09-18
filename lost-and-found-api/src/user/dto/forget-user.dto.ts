import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class ForgetUserDto {
  @IsNotEmpty({ message: '账户名不能为空' })
  @ApiProperty({ description: '账户名' })
  readonly username: string;
}
