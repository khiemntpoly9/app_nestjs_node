/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionHistory } from 'src/db/entity/action_history.entity';

@Module({
	imports: [TypeOrmModule.forFeature([ActionHistory])],
	controllers: [ManagerController],
	providers: [ManagerService],
	exports: [ManagerService],
})
export class ManagerModule {}
