import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: '作者id不能为空' })
  @ApiProperty({ description: '作者id' })
  readonly userId: string;

  @IsNotEmpty({ message: '物品id不能为空' })
  @ApiProperty({ description: '物品id' })
  @ApiProperty()
  readonly itemId: string;

  @IsNotEmpty({ message: '内容不能为空' })
  @ApiProperty({ description: '内容' })
  readonly content: string;
}
