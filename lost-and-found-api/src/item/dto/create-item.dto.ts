import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateItemDto {
  // @IsNotEmpty({ message: '类型不能为空' })
  @ApiProperty({ description: '事件类型' })
  readonly type: string;

  // @IsNotEmpty({ message: '标题不能为空' })
  @ApiProperty({ description: '标题' })
  readonly title: string;

  // @IsNotEmpty({ message: '地点不能为空' })
  @ApiProperty({ description: '地点' })
  readonly place: string;

  // @IsNotEmpty({ message: '日期不能为空' })
  @ApiProperty({ description: '日期' })
  readonly time: Date; 

  // @IsNotEmpty({ message: '联系方式不能为空' })
  @ApiProperty({ description: '联系方式' })
  readonly contact: string;

  @ApiProperty({ description: '描述' })
  readonly description: string;

  @ApiProperty({ description: '图片地址' })
  photoPath: string;

  @ApiProperty({ description: '用户id' })
  userId: string;
}
