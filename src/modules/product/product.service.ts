/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity
import { Product } from 'src/db/entity/product.entity';
import { DeltailProd } from 'src/db/entity/detail_prod.entity';
import { ImgProduct } from 'src/db/entity/imageproduct.entity';
// DTO
import { productDto } from './dto/product.dto';
import { imagesDto } from './dto/images.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private productRepository: Repository<Product>,
		@InjectRepository(DeltailProd)
		private prodDetailRepository: Repository<DeltailProd>,
		@InjectRepository(ImgProduct)
		private prodImgRepository: Repository<ImgProduct>,
		private cloudinaryService: CloudinaryService,
	) {}

	/* Tạo sản phẩm mới */
	async createProduct(productDto: productDto, up_thumbnail: imagesDto): Promise<Product> {
		try {
			const product = new Product();
			product.name_prod = productDto.name_prod;
			product.id_categories = productDto.id_categories;
			product.brand_prod = productDto.brand_prod;
			product.price_prod = productDto.price_prod;
			product.material_prod = productDto.material_prod;
			product.style_prod = productDto.style_prod;
			product.img_thumbnail = up_thumbnail.secure_url;
			product.public_id = up_thumbnail.public_id;
			product.quantity = productDto.quantity;
			product.show_prod = productDto.show_prod;
			//
			const saveProduct = await this.productRepository.save(product);
			return saveProduct;
		} catch (error) {
			throw new Error(error);
		}
	}

	/* Tạo thông tin sản phẩm */
	async createProductDetail(id_prod: number, productDto: productDto): Promise<DeltailProd> {
		try {
			const detailProd = new DeltailProd();
			detailProd.id_product = id_prod;
			detailProd.detail_prod = productDto.detail_prod;
			// Save
			const saveProductDetail = await this.prodDetailRepository.save(detailProd);
			return saveProductDetail;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Thêm ảnh sản phẩm
	async addImgProduct(id_prod: number, list_img: imagesDto[]): Promise<ImgProduct[]> {
		try {
			const imgProducts: ImgProduct[] = [];

			for (const imgItem of list_img) {
				const imgProd = new ImgProduct();
				imgProd.id_product = id_prod;
				imgProd.public_id = imgItem.public_id;
				imgProd.url = imgItem.secure_url;
				const saveImgProd = await this.prodImgRepository.save(imgProd);
				imgProducts.push(saveImgProd);
			}
			return imgProducts;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy all tất cả sản phẩm, không phân trang
	async findAll(): Promise<Product[]> {
		try {
			const result = await this.productRepository
				.createQueryBuilder('products')
				.leftJoinAndSelect('products.categories', 'categories')
				.leftJoinAndSelect('products.brands', 'brands')
				.leftJoinAndSelect('products.img_prod', 'img_prod')
				.leftJoinAndSelect('products.detail_prod', 'detail_prod')
				.leftJoinAndSelect('products.color', 'color')
				.where('products.show_prod = 1')
				.select([
					/* Product */
					'products.id_product',
					'products.name_prod',
					'products.price_prod',
					'products.img_thumbnail',
					'products.public_id',
					'products.createdAt',
					'products.updatedAt',
					/* Categories */
					'categories.id_categories',
					'categories.name_categories',
					/* Brand */
					'brands.id_brand',
					'brands.name_brand',
					/* Images  */
					'img_prod.id_images',
					'img_prod.url',
					'img_prod.public_id',
					/* Detail Product */
					'detail_prod.detail_prod',
					/* Color */
					'color.name_color',
					'color.hex_color',
				])
				.orderBy('products.createdAt', 'DESC')
				.getMany();
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy tất cả sản phẩm, có phân trang
	async findAllPagination(page: number, limit: number): Promise<Product[]> {
		try {
			const result = await this.productRepository
				.createQueryBuilder('products')
				.leftJoinAndSelect('products.categories', 'categories')
				.leftJoinAndSelect('products.brands', 'brands')
				.leftJoinAndSelect('products.img_prod', 'img_prod')
				.leftJoinAndSelect('products.detail_prod', 'detail_prod')
				.leftJoinAndSelect('products.color', 'color')
				.where('products.show_prod = 1')
				.select([
					/* Product */
					'products.id_product',
					'products.name_prod',
					'products.price_prod',
					'products.img_thumbnail',
					'products.public_id',
					'products.createdAt',
					'products.updatedAt',
					/* Categories */
					'categories.id_categories',
					'categories.name_categories',
					/* Brand */
					'brands.id_brand',
					'brands.name_brand',
					/* Images  */
					'img_prod.id_images',
					'img_prod.url',
					'img_prod.public_id',
					/* Detail Product */
					'detail_prod.detail_prod',
					/* Color */
					'color.name_color',
					'color.hex_color',
				])
				.orderBy('products.createdAt', 'DESC')
				.skip((page - 1) * limit)
				.take(limit)
				.getMany();
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy sản phẩm chi tiết
	async getProductId(id: number): Promise<Product> {
		try {
			const result = await this.productRepository
				.createQueryBuilder('products')
				.leftJoinAndSelect('products.categories', 'categories')
				.leftJoinAndSelect('categories.parent', 'parent')
				.leftJoinAndSelect('products.brands', 'brands')
				.leftJoinAndSelect('products.img_prod', 'img_prod')
				.leftJoinAndSelect('products.detail_prod', 'detail_prod')
				.leftJoinAndSelect('products.color', 'color')
				.select([
					/* Product */
					'products.id_product',
					'products.name_prod',
					'products.price_prod',
					'products.img_thumbnail',
					'products.public_id',
					'products.createdAt',
					'products.updatedAt',
					/* Categories */
					'categories.id_categories',
					'categories.name_categories',
					'parent.id_categories',
					'parent.name_categories',
					/* Brand */
					'brands.id_brand',
					'brands.name_brand',
					/* Images  */
					'img_prod.id_images',
					'img_prod.public_id',
					'img_prod.url',
					/* Detail Product */
					'detail_prod.detail_prod',
					/* Color */
					'color.name_color',
					'color.hex_color',
				])
				.where('products.id_product = :id', { id })
				.getOne();
			if (!result) {
				throw new Error('Không tìm thấy sản phẩm!');
			}
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}

	/* Cập nhật sản phẩm */
	async updateProduct(id: number, productDto: Partial<productDto>): Promise<Product> {
		const product = await this.productRepository.findOneBy({ id_product: id });
		// Check
		if (!product) {
			throw new Error('Không tìm thấy sản phẩm!');
		}
		Object.assign(product, productDto);
		return this.productRepository.save(product);
	}

	/* Cập nhật sản phẩm chi tiết */
	async updateProductDetai(id: number, productDto: Partial<productDto>): Promise<DeltailProd> {
		try {
			const productDetail = await this.prodDetailRepository.findOneBy({
				id_product: id,
			});
			if (!productDetail) {
				throw new Error('Không tìm thấy sản phẩm!');
			}
			Object.assign(productDetail, productDto);
			return this.prodDetailRepository.save(productDetail);
		} catch (error) {
			throw new Error(error);
		}
	}

	// Cập nhật hình ảnh sản phẩm
	async updateImageProduct(id: number, public_id: string, secure_url: string): Promise<void> {
		try {
			const img_thumbnail = await this.productRepository
				.createQueryBuilder('products')
				.update(Product)
				.set({
					img_thumbnail: secure_url,
					public_id: public_id,
				})
				.where('id_product = :id', { id: id })
				.execute();
		} catch (error) {
			throw new Error(error);
		}
	}

	/* Xoá hình ảnh sản phẩm */
	async delImgProd(idp: string): Promise<void> {
		try {
			// Xoá ảnh trên cloud
			await this.cloudinaryService.deleteFile(idp);
			// Xoá database
			const img_prod = await this.prodImgRepository.delete({
				public_id: idp,
			});
		} catch (error) {
			throw new Error(error);
		}
	}

	/* Xoá sản phẩm */
	async deleteProduct(id: number): Promise<void> {
		try {
			const product = await this.productRepository.findOneBy({
				id_product: id,
			});
			// Kiểm tra xem có sản phẩm không
			if (product) {
				// Xoá ảnh thumbnail trên cloud
				const delThumbnail = await this.cloudinaryService.deleteFile(product.public_id);
				// Lấy data detail
				const productDetail = await this.productRepository
					.createQueryBuilder('product')
					.leftJoinAndSelect('product.detail_prod', 'detail_prod')
					.where('product.id_product = :id', { id: product.id_product })
					.getOne();
				// Kiểm tra mối quan hệ trước khi xoá
				if (productDetail && productDetail.detail_prod) {
					const detailProd = productDetail.detail_prod;
					// Xóa detailProd
					await this.prodDetailRepository.remove(detailProd);
				}
				// Lấy hình ảnh
				const productImg = await this.productRepository
					.createQueryBuilder('product')
					.leftJoinAndSelect('product.img_prod', 'img_prod')
					.where('product.id_product = :id', { id: product.id_product })
					.getMany();
				//
				if (productImg && productImg.length > 0) {
					const imgProds = productImg.map((product) => product.img_prod); // Mảng các hình ảnh
					// Lấy public_id
					const publicIds = imgProds.map((imgArray) => imgArray.map((img) => img.public_id));
					// Tiến hành xoá
					const deleteImageCloud = publicIds.flat().map(async (item) => {
						const del = await this.cloudinaryService.deleteFile(item);
					});
					// Xoá trong database
					for (const imgProd of imgProds) {
						// Xoá từng hình ảnh
						await this.prodImgRepository.remove(imgProd);
					}
				}
			} else {
				throw new Error('Sản phẩm không tồn tại!');
			}
			// Xoá product
			await this.productRepository.remove(product);
		} catch (error) {
			throw new Error(error);
		}
	}

	// Tìm kiếm sản phẩm theo tên
	async searchProduct(keyword: string): Promise<Product[]> {
		try {
			const result = await this.productRepository
				.createQueryBuilder('products')
				.leftJoinAndSelect('products.img_prod', 'img_prod')
				.leftJoinAndSelect('products.detail_prod', 'detail_prod')
				.leftJoinAndSelect('products.brands', 'brands')
				.leftJoinAndSelect('products.categories', 'categories')
				.leftJoinAndSelect('products.color', 'color')
				.where('products.show_prod = :show', { show: 1 })
				.andWhere('LOWER(SUBSTRING(products.name_prod, 1, 1)) = LOWER(:firstLetter)', {
					firstLetter: keyword.charAt(0),
				})
				.orderBy('products.createdAt', 'DESC')
				.getMany();
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy sản phẩm theo danh mục
	async getProductByCategory(id: number): Promise<Product[]> {
		try {
			const result = await this.productRepository
				.createQueryBuilder('products')
				.leftJoinAndSelect('products.img_prod', 'img_prod')
				.leftJoinAndSelect('products.detail_prod', 'detail_prod')
				.leftJoinAndSelect('products.brands', 'brands')
				.leftJoinAndSelect('products.categories', 'categories')
				.leftJoinAndSelect('products.color', 'color')
				.where('products.show_prod = :show', { show: 1 })
				.andWhere('products.id_category = :id', { id: id })
				.orderBy('products.createdAt', 'DESC')
				.getMany();
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy sản phẩm theo thương hiệu
	async getProductByBrand(id: number): Promise<Product[]> {
		try {
			const result = await this.productRepository
				.createQueryBuilder('products')
				.leftJoinAndSelect('products.img_prod', 'img_prod')
				.leftJoinAndSelect('products.detail_prod', 'detail_prod')
				.leftJoinAndSelect('products.brands', 'brands')
				.leftJoinAndSelect('products.categories', 'categories')
				.leftJoinAndSelect('products.color', 'color')
				.where('products.show_prod = :show', { show: 1 })
				.andWhere('products.id_brand = :id', { id: id })
				.orderBy('products.createdAt', 'DESC')
				.getMany();
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy sản phẩm theo giá
	async getProductByPrice(price: number): Promise<Product[]> {
		try {
			const result = await this.productRepository
				.createQueryBuilder('products')
				.leftJoinAndSelect('products.img_prod', 'img_prod')
				.leftJoinAndSelect('products.detail_prod', 'detail_prod')
				.leftJoinAndSelect('products.brands', 'brands')
				.leftJoinAndSelect('products.categories', 'categories')
				.leftJoinAndSelect('products.color', 'color')
				.where('products.show_prod = :show', { show: 1 })
				.andWhere('products.price_prod <= :price', { price: price })
				.orderBy('products.createdAt', 'DESC')
				.getMany();
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy sản phẩm trong khoảng giá
	async getProductByPriceRange(min: number, max: number): Promise<Product[]> {
		try {
			const result = await this.productRepository
				.createQueryBuilder('products')
				.leftJoinAndSelect('products.img_prod', 'img_prod')
				.leftJoinAndSelect('products.detail_prod', 'detail_prod')
				.leftJoinAndSelect('products.brands', 'brands')
				.leftJoinAndSelect('products.categories', 'categories')
				.leftJoinAndSelect('products.color', 'color')
				.where('products.show_prod = :show', { show: 1 })
				.andWhere('products.price_prod >= :min AND products.price_prod <= :max', { min: min, max: max })
				.orderBy('products.createdAt', 'DESC')
				.getMany();
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}

	// Lấy danh sách sản phẩm (admin)
	async findAllProductAdmin(page: number, limit: number): Promise<Product[]> {
		try {
			const result = await this.productRepository
				.createQueryBuilder('products')
				.leftJoinAndSelect('products.categories', 'categories')
				.leftJoinAndSelect('products.brands', 'brands')
				.leftJoinAndSelect('products.img_prod', 'img_prod')
				.leftJoinAndSelect('products.detail_prod', 'detail_prod')
				.leftJoinAndSelect('products.color', 'color')
				.leftJoinAndSelect('products.action_history', 'action_history')
				.leftJoinAndSelect('action_history.users', 'users')
				.leftJoinAndSelect('users.role', 'role')
				.where('action_history.action_type = :action', { action: 'create' })
				.select([
					/* Product */
					'products.id_product',
					'products.name_prod',
					'products.price_prod',
					'products.quantity',
					'products.show_prod',
					'products.img_thumbnail',
					'products.public_id',
					'products.createdAt',
					'products.updatedAt',
					/* Categories */
					'categories.id_categories',
					'categories.name_categories',
					/* Brand */
					'brands.id_brand',
					'brands.name_brand',
					'action_history.action_type',
					'users.id_user',
					'users.first_name',
					'users.last_name',
					'role.name_role',

					/* Images  */
					// 'img_prod.id_images',
					// 'img_prod.url',
					// 'img_prod.public_id',
					/* Detail Product */
					// 'detail_prod.detail_prod',
					/* Color */
					// 'color.name_color',
					// 'color.hex_color',
				])
				.orderBy('products.createdAt', 'DESC')
				.skip((page - 1) * limit)
				.take(limit)
				.getMany();
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}
}
