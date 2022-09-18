import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { ItemModule } from './item/item.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, AuthModule, UploadModule, ItemModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
