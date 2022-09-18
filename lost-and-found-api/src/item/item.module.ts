import { CommentService } from './../comment/comment.service';
import { CommentModule } from './../comment/comment.module';
import { UserModule } from './../user/user.module';
import { Item } from './entities/item.entity';
import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import * as dayjs from 'dayjs';
import * as nuid from 'nuid';
import { diskStorage } from 'multer';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Item]),
    MulterModule.register({
      storage: diskStorage({
        // 配置文件上传后的文件夹路径
        destination: `./public/uploads/${dayjs().format('YYYY-MM-DD')}`,
        filename: (req, file, cb) => {
          // 在此处自定义保存后的文件名称
          const filename = `${nuid.next()}.${file.mimetype.split('/')[1]}`;
          return cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
