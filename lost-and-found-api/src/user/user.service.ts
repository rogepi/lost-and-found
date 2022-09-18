import { LoginUserDto } from './dto/login-user.dto';
import { Item } from './../item/entities/item.entity';
import { User } from './entities/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getRepository, Repository } from 'typeorm';
import { compareSync } from 'bcryptjs';
import { ForgetUserDto } from './dto/forget-user.dto';

export interface UsersRo {
  list: User[];
  count: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username } = createUserDto;

    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existUser) {
      return { msg: '用户已存在', status: '1' };
    }
    const newUser = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    let existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (!existUser) {
      existUser = await this.userRepository.findOne({
        where: { phone: username },
      });
      if (!existUser) {
        return {
          message: '用户名不存在',
          status: 1,
        };
      }
    }
    if (!compareSync(password, existUser.password)) {
      console.log(password);
      return {
        message: '密码不正确',
        status: 2,
      };
    }
    return {
      messaeg: '登录成功',
      status: 3,
      userId: existUser.id,
      role: existUser.role,
      nickname: existUser.nickname,
      avatarPath: existUser.avatarPath,
    };
  }

  async forget(forgetUserDto: ForgetUserDto) {
    const { username } = forgetUserDto;
    let existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (!existUser) {
      existUser = await this.userRepository.findOne({
        where: { phone: username },
      });
      if (!existUser) {
        return {
          message: '用户不存在',
          status: 1,
        };
      }
    } else {
      return {
        status: 2,
        id: existUser.id,
        question: existUser.question,
        answer: existUser.answer,
      };
    }
  }

  async findAll(query): Promise<UsersRo> {
    const qb = await getRepository(User).createQueryBuilder('user');
    qb.where('1 = 1');
    if (query.role) qb.where(`role = ${query.role}`);

    if (query.role && query.key)
      qb.where(`role = ${query.role}`).andWhere(
        `${query.column} LIKE :param  `,
        {
          param: '%' + query.key + '%',
        },
      );

    qb.orderBy('user.create_time', 'ASC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const data = await qb.getMany();
    return { list: data, count: count };
  }

  async findOne(id: string): Promise<User> {
    const existUser = await this.userRepository.findOne(id);
    if (!existUser) {
      throw new HttpException('用户不存在', 401);
    }
    return existUser;
  }

  async find(username: string): Promise<User> {
    const existUser = await this.userRepository.findOne({ username });
    if (!existUser) {
      throw new HttpException('用户不存在', 401);
    }
    return existUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existUser = await this.userRepository.findOne(id);
    if (!existUser) {
      throw new HttpException('用户不存在', 401);
    }
    const updateUser = this.userRepository.merge(existUser, updateUserDto);
    return this.userRepository.save(updateUser);
  }

  async remove(id: string) {
    const existPost = await this.userRepository.findOne(id);
    if (!existPost) {
      throw new HttpException('用户不存在', 401);
    }
    return await this.userRepository.remove(existPost);
  }

  async addItem(user: User, item: Item) {
    user.items = [...user.items, item];
    return await this.userRepository.save(user);
  }

  async getAvatar(id: string) {
    return await (
      await this.findOne(id)
    ).avatarPath;
  }
}
