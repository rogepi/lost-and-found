import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiProperty({ description: '标题' })
  readonly title: string;

  @ApiProperty({ description: '地点' })
  readonly place: string;

  @ApiProperty({ description: '联系方式' })
  readonly contact: string;

  @ApiProperty({ description: '描述' })
  readonly description: string;

  @ApiProperty({ description: '状态' })
  readonly state: string;
}
