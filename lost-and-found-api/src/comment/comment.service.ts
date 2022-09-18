import { UserService } from './../user/user.service';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemService } from 'src/item/item.service';
import { getRepository, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

export interface CommentsRo {
  list: Comment[];
  count: number;
}

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private itemService: ItemService,
    private userService: UserService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const item = await this.itemService.findOne(createCommentDto.itemId);
    const user = await this.userService.findOne(createCommentDto.userId);
    const newComment = await this.commentRepository.create({
      ...createCommentDto,
      author: user.nickname,
      avatar: user.avatarPath,
    });
    newComment.item = item;
    return await this.commentRepository.save(newComment);
  }

  async findAll(query): Promise<CommentsRo> {
    const qb = await this.commentRepository.createQueryBuilder('comment');
    qb.where('1 = 1');
    qb.orderBy('comment.create_time', 'ASC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10 } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const data = await qb.getMany();
    return { list: data, count: count };
  }

  async findOne(id: number): Promise<Comment> {
    const existComment = await this.commentRepository.findOne(id);
    if (!existComment) {
      throw new HttpException('评论不存在', 401);
    }
    return existComment;
  }

  async findByItemId(id: string): Promise<CommentsRo> {
    const qb = await getRepository(Comment).createQueryBuilder('comment');
    qb.where(`itemId = ${id}`);
    qb.orderBy('comment.create_time', 'ASC');
    const data = await qb.getMany();
    const count = await qb.getCount();
    return { list: data, count: count };
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const existComment = await this.commentRepository.findOne(id);
    if (!existComment) {
      throw new HttpException('物品不存在', 401);
    }

    const updateComment = this.commentRepository.merge(
      existComment,
      updateCommentDto,
    );
    return this.commentRepository.save(updateComment);
  }

  async remove(id: string) {
    const existComment = await this.commentRepository.findOne(id);
    if (!existComment) {
      throw new HttpException('物品不存在', 401);
    }
    return await this.commentRepository.remove(existComment);
  }

  async removeByItem(id: string) {
    const result = await this.findByItemId(id);
    for (let i = 0; i < result.count; i++) {
      await this.remove(result.list[i].id);
    }
    return 'success';
  }
}
