import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/db/entity/brand.entity';
import { Repository } from 'typeorm';
import { brandDto } from './dto/brand.dto';

@Injectable()
export class BrandService {
	constructor(
		@InjectRepository(Brand)
		private brandRepository: Repository<Brand>,
	) {}

	// Lấy tất cả thương hiệu
	async getAllBrand(): Promise<Brand[]> {
		try {
			const brand = await this.brandRepository.find();
			return brand;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Thêm thương hiệu
	async createBrand(brandDto: brandDto): Promise<Brand> {
		try {
			const brand = new Brand();
			brand.name_brand = brandDto.name_brand;
			//
			const saveBrand = await this.brandRepository.save(brand);
			return saveBrand;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Sửa thương hiệu
	async updateBrand(id: number, brandDto: Partial<brandDto>): Promise<Brand> {
		try {
			const brand = await this.brandRepository.findOneBy({
				id_brand: id,
			});
			if (!brand) {
				throw new Error('Không tìm thấy thương hiệu!');
			}
			Object.assign(brand, brandDto);
			return this.brandRepository.save(brand);
		} catch (error) {
			throw new Error(error);
		}
	}

	// Xoá thương hiệu
	async deleteBrand(id: number): Promise<Brand> {
		try {
			const brand = await this.brandRepository.findOneBy({
				id_brand: id,
			});
			if (!brand) {
				throw new Error('Không tìm thấy thương hiệu!');
			}
			return this.brandRepository.remove(brand);
		} catch (error) {
			throw new Error(error);
		}
	}
}
