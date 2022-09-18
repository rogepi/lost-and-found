import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

const jwtModule = JwtModule.register({
  secret: 'test123456',
  signOptions: { expiresIn: '4h' },
});

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User]), jwtModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [jwtModule],
})
export class AuthModule {}
