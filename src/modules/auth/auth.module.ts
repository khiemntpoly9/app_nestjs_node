/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/db/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthGuard } from './guards/auth.guard';
import { GoogleStrategy } from './utils/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './utils/local.strategy';
import { JwtStrategy } from './utils/jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.register({ global: true, secret: jwtConstants.secret, signOptions: { expiresIn: '24h' } }),
		UserModule,
		PassportModule,
	],
	controllers: [AuthController],
	providers: [AuthService, UserService, AuthGuard, LocalStrategy, JwtStrategy, GoogleStrategy],
	exports: [AuthService],
})
export class AuthModule {}
