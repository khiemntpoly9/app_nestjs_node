import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../db/entity/product.entity';
import { Favorites } from 'src/db/entity/favotites.entity';
import { User } from 'src/db/entity/user.entity';
@Module({
	imports: [TypeOrmModule.forFeature([Product, Favorites, User])],
	controllers: [FavoriteController],
	providers: [FavoriteService],
})
export class FavoriteModule {}
