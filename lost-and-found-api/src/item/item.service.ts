import { UserService } from './../user/user.service';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './entities/item.entity';
import { Comment } from 'src/comment/entities/comment.entity';

export interface ItemsRo {
  list: Item[];
  count: number;
}

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    private userService: UserService,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const newItem = await this.itemRepository.create(createItemDto);
    const user = await this.userService.findOne(createItemDto.userId);
    newItem.user = user;
    // await this.userService.addItem(user, newItem);
    return await this.itemRepository.save(newItem);
  }

  async findAll(query: {
    pageNum: number;
    pageSize: number;
    type: string;
    state: string;
    key: string;
  }): Promise<ItemsRo> {
    const qb = await getRepository(Item).createQueryBuilder('item');
    qb.where('1 = 1');
    if (query.type) qb.where(`type = ${query.type}`);
    if (query.state) qb.where(`state = ${query.state}`);
    if (query.key)
      qb.where('title LIKE :param', {
        param: '%' + query.key + '%',
      });
    if (query.type && query.state)
      qb.where(`type = ${query.type} AND state = ${query.state}`);
    if (query.key && query.state)
      qb.where(`title LIKE :param AND state = ${query.state}`, {
        param: '%' + query.key + '%',
      });
    if (query.key && query.type)
      qb.where(`title LIKE :param AND type = ${query.type}`, {
        param: '%' + query.key + '%',
      });
    if (query.key && query.type && query.state)
      qb.where(
        `title LIKE :param AND type = ${query.type} AND state = ${query.state}`,
        {
          param: '%' + query.key + '%',
        },
      );

    qb.orderBy('item.create_time', 'DESC');
    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10 } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const data = await qb.getMany();
    return { list: data, count: count };
  }

  async findOne(id: string): Promise<Item> {
    const existItem = await this.itemRepository.findOne(id);
    if (!existItem) {
      throw new HttpException('物品不存在', 401);
    }
    return existItem;
  }

  async findByUserId(id: string): Promise<ItemsRo> {
    const qb = await getRepository(Item).createQueryBuilder('item');
    qb.where(`userId = ${id}`);
    qb.orderBy('item.create_time', 'ASC');
    const data = await qb.getMany();
    const count = await qb.getCount();
    return { list: data, count: count };
  }

  async update(id: number, updateItemDto: CreateItemDto) {
    const existItem = await this.itemRepository.findOne(id);
    if (!existItem) {
      throw new HttpException('物品不存在', 401);
    }

    const updateItem = this.itemRepository.merge(existItem, updateItemDto);
    return this.itemRepository.save(updateItem);
  }

  async remove(id: number) {
    const existItem = await this.itemRepository.findOne(id);
    if (!existItem) {
      throw new HttpException('物品不存在', 401);
    }
    return await this.itemRepository.remove(existItem);
  }
}
