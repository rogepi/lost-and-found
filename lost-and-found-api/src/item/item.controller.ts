import { GetItemDto } from './dto/get-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { ApiTags } from '@nestjs/swagger';
import { staticBaseUrl } from './constants';

@ApiTags('物品')
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createItemDto: CreateItemDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(createItemDto);
    console.log(file);
    createItemDto.photoPath = file ? staticBaseUrl + file.path.slice(7) : '';

    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll(
    @Query()
    query: {
      pageNum: number;
      pageSize: number;
      type: string;
      state: string;
      key: string;
    },
  ) {
    return this.itemService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    return this.itemService.findByUserId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: CreateItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
