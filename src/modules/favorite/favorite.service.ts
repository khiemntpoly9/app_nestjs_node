// Favorite Service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
// Entity
import { Favorites } from 'src/db/entity/favotites.entity';
import { Product } from 'src/db/entity/product.entity';
import { User } from 'src/db/entity/user.entity';

@Injectable()
export class FavoriteService {
	constructor(
		@InjectRepository(Favorites)
		private favoriteRepository: Repository<Favorites>,
		@InjectRepository(Product)
		private productRepository: Repository<Product>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	// Thêm sản phẩm vào danh sách yêu thích
	async create(createFavoriteDto: CreateFavoriteDto, id_user: number) {
		const product = await this.productRepository.findOne({
			where: { id_product: createFavoriteDto.id_product },
		});
		if (!product) throw new Error('Sản phẩm không tồn tại!');
		// Check kiểm tra đã tồn tại yêu thích
		const checkFavorite = await this.favoriteRepository.findOne({
			where: { id_product: createFavoriteDto.id_product, id_user: id_user },
		});
		if (checkFavorite) throw new Error('Sản phẩm đã có trong danh sách yêu thích!');
		// Thêm sản phẩm vào danh sách yêu thích
		const favorite = new Favorites();
		favorite.id_user = id_user;
		favorite.id_product = createFavoriteDto.id_product;
		// Lưu yêu thích
		return await this.favoriteRepository.save(favorite);
	}

	// Lấy danh sách yêu thích
	async getFavoriteUser(id_user: number) {
		const userFavorite = await this.favoriteRepository
			.createQueryBuilder('favorites')
			.leftJoinAndSelect('favorites.product', 'product')
			.where('favorites.id_user = :id_user', { id_user })
			.select(['favorites.id_favorites', 'product.id_product', 'product.name_prod', 'product.img_thumbnail'])
			.getMany();
		return userFavorite;
	}

	// Xoá sản phẩm khỏi danh sách yêu thích
	async deleteFavorite(id: number, id_user: number) {
		const favorite = await this.favoriteRepository.findOne({
			where: { id_product: id, id_user: id_user },
		});
		if (!favorite) throw new Error('Sản phẩm không tồn tại trong danh sách yêu thích!');
		return await this.favoriteRepository.delete(favorite);
	}

	// Xoá tất cả yêu thích của người dùng
	async deleteAllFavorite(id_user: number) {
		const favorites = await this.favoriteRepository.find({
			where: { id_user: id_user },
		});
		if (favorites.length === 0) throw new Error('Sản phẩm không tồn tại trong danh sách yêu thích!');
		for (const favorite of favorites) {
			await this.favoriteRepository.remove(favorite);
		}
	}
}
