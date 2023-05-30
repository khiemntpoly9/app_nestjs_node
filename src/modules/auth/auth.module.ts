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
import { AuthGuard } from './auth.guard';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.register({ global: true, secret: jwtConstants.secret, signOptions: { expiresIn: '60m' } }),
		UserModule,
	],
	controllers: [AuthController],
	providers: [AuthService, UserService, AuthGuard],
	exports: [AuthService],
})
export class AuthModule {}
