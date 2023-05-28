/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/db/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.register({ global: true, secret: jwtConstants.secret, signOptions: { expiresIn: '6h' } }),
	],
	controllers: [AuthController],
	providers: [AuthService, AuthGuard],
})
export class AuthModule {}
