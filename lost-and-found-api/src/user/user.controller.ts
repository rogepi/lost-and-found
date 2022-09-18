import { ForgetUserDto } from './dto/forget-user.dto';
import { staticBaseUrl } from './constants';
import { LoginUserDto } from './dto/login-user.dto';
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
import { UserService, UsersRo } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Post('forget')
  forget(@Body() forgetUserDto: ForgetUserDto) {
    return this.userService.forget(forgetUserDto);
  }

  @Get()
  findAll(@Query() query): Promise<UsersRo> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    updateUserDto.avatarPath = file
      ? staticBaseUrl + file.path.slice(7)
      : 'http://localhost:9080/static/uploads/static/3ea6beec64369c2642b92c6726f1epng.png';
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get('avatar/:id')
  getAvatar(@Param('id') id: string) {
    return this.userService.getAvatar(id);
  }
}
