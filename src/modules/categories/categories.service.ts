import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/db/entity/categories.entity';
import { Repository } from 'typeorm';
import { categoryDto } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(Category)
		private categoryRepository: Repository<Category>,
	) {}
	// Lấy tất cả danh mục
	async getAllCategories(): Promise<Category[]> {
		try {
			const categories = await this.categoryRepository
				.createQueryBuilder('categories')
				.where('categories.parent_id IS NULL')
				.leftJoinAndMapMany(
					'categories.children',
					Category,
					'children',
					'children.parent_id = categories.id_categories',
				)
				.orderBy('categories.id_categories', 'DESC')
				.getMany();
			return categories;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Thêm danh mục
	async createCategories(categoryDto: categoryDto): Promise<Category> {
		try {
			const category = new Category();
			category.name_categories = categoryDto.name_categories;
			category.parent_id = categoryDto.parent_id;
			//
			const saveCate = await this.categoryRepository.save(category);
			return saveCate;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Sửa danh mục
	async updateCategories(id: number, categoryDto: Partial<categoryDto>): Promise<Category> {
		try {
			const category = await this.categoryRepository.findOneBy({
				id_categories: id,
			});
			if (!category) {
				throw new Error('Không tìm thấy danh mục!');
			}
			Object.assign(category, categoryDto);
			return this.categoryRepository.save(category);
		} catch (error) {
			throw new Error(error);
		}
	}

	// Xoá danh mục
	async deleteCategories(id: number): Promise<void> {
		try {
			const category = await this.categoryRepository.findOneBy({
				id_categories: id,
			});
			if (!category) {
				throw new Error('Không tìm thấy danh mục!');
			}
			await this.categoryRepository.remove(category);
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy tất cả danh mục cha
	async getAllParentCategories(): Promise<Category[]> {
		try {
			const categories = await this.categoryRepository
				.createQueryBuilder('categories')
				.leftJoinAndSelect('categories.user', 'user')
				.leftJoinAndSelect('user.role', 'role')
				.select(['categories', 'user.id_user', 'user.first_name', 'user.last_name', 'role.name_role'])
				.where('categories.parent_id IS NULL')
				.orderBy('categories.id_categories', 'DESC')
				.getMany();
			return categories;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy tất cả danh mục con
	async getAllChildCategories(): Promise<Category[]> {
		try {
			const categories = await this.categoryRepository
				.createQueryBuilder('categories')
				.leftJoinAndSelect('categories.parent', 'parent')
				.leftJoinAndSelect('categories.user', 'user')
				.leftJoinAndSelect('user.role', 'role')
				.select([
					'categories',
					'parent.id_categories',
					'parent.name_categories',
					'user.id_user',
					'user.first_name',
					'user.last_name',
					'role.name_role',
				])
				.where('categories.parent_id IS NOT NULL')
				.orderBy('categories.id_categories', 'DESC')
				.getMany();
			return categories;
		} catch (error) {
			throw new Error(error);
		}
	}
}
