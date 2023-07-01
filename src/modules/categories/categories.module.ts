import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/db/entity/categories.entity';
import { ActionHistory } from 'src/db/entity/action_history.entity';
import { ManagerService } from '../manager/manager.service';

@Module({
	imports: [TypeOrmModule.forFeature([Category, ActionHistory])],
	controllers: [CategoriesController],
	providers: [CategoriesService, ManagerService],
})
export class CategoriesModule {}
