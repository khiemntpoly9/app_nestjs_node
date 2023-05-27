/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from 'src/db/entity/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [],
	providers: [UserService],
})
export class UserModule {}
