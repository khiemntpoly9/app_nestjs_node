/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Controller,
	Get,
	Res,
	HttpException,
	HttpStatus,
	Post,
	Patch,
	Body,
	Query,
	Delete,
	UseGuards,
	UseInterceptors,
	UploadedFiles,
	Req,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './product.service';
import { productDto } from './dto/product.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MulterOptions } from './multerOption';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ManagerService } from '../manager/manager.service';

interface User extends Request {
	user: {
		userId: number;
		email: string;
		role: string;
	};
}

@Controller()
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private readonly managerService: ManagerService,
		private cloudinaryService: CloudinaryService,
	) {}

	// Thêm sản phẩm
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(JwtAuthGuard)
	@Post('product')
	@UseInterceptors(
		FileFieldsInterceptor([{ name: 'img_thumbnail', maxCount: 1 }, { name: 'list_img' }], MulterOptions),
	)
	async createProduct(
		// Nhận file
		@UploadedFiles()
		files: { img_thumbnail: Express.Multer.File; list_img: Express.Multer.File[] },
		@Body() productDto: productDto,
		@Res() res: Response,
		@Req() req: User,
	) {
		try {
			// Upload thumbnail
			const images_thumbnail = files.img_thumbnail[0];
			const up_thumbnail = await this.cloudinaryService.uploadFile(images_thumbnail);
			const img_thumbnail_index = {
				public_id: up_thumbnail.public_id,
				secure_url: up_thumbnail.secure_url,
			};
			// Tạo sản phẩm
			const createProduct = await this.productService.createProduct(productDto, img_thumbnail_index);
			const newProductId = createProduct.id_product;
			//  Tạo thông tin sản phẩm
			const createProductDetail = await this.productService.createProductDetail(newProductId, productDto);
			// Thêm hình ảnh sản phẩm
			// Upload file ảnh
			const uploadPromises = files.list_img.map(async (file) => {
				const upload = await this.cloudinaryService.uploadFile(file);
				return upload;
			});
			// result
			const uploads = await Promise.all(uploadPromises);
			// Xử lý kết quả trả về
			const list_img = uploads.map((item) => {
				return {
					public_id: item.public_id,
					secure_url: item.secure_url,
				};
			});
			const addImgProduct = await this.productService.addImgProduct(newProductId, list_img);
			// Ghi lịch sử hành động
			const log = await this.managerService.createActionHistory(
				req.user.userId,
				'create',
				newProductId,
				null,
				`Thêm sản phẩm #${newProductId} ${productDto.name_prod}`,
			);
			// final
			return res.status(HttpStatus.OK).json({ message: 'Tạo sản phẩm thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Lấy tất cả sản phẩm
	@Get('products')
	async getAllProduct(@Res() res: Response) {
		try {
			const data = await this.productService.findAll();
			return res.status(HttpStatus.OK).json(data);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Lấy chi tiết sản phẩm
	@Get('product')
	async getProduct(@Query('id') id: number, @Res() res: Response) {
		try {
			const data = await this.productService.getProductId(id);
			return res.status(HttpStatus.OK).json(data);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Cập nhật sản phẩm
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(JwtAuthGuard)
	@Patch('product')
	@UseInterceptors(
		FileFieldsInterceptor([{ name: 'img_thumbnail', maxCount: 1 }, { name: 'list_img' }], MulterOptions),
	)
	async updateProduct(
		// Nhận file
		@UploadedFiles()
		files: { img_thumbnail: Express.Multer.File; list_img: Express.Multer.File[] },
		@Query('id') id: number,
		@Body() productDto: productDto,
		@Res() res: Response,
		@Req() req: User,
	) {
		try {
			// Check xem có sản phẩm không
			const prodDetail = await this.productService.getProductId(id);
			// Check xem có img_thubnail, nếu có thì xoá ảnh cũ và upload ảnh mới
			if (files.img_thumbnail) {
				// Xoá ảnh trên cloud
				await this.cloudinaryService.deleteFile(prodDetail.public_id);
				// Lấy ảnh mới, thêm vào db
				const images_thumbnail = files.img_thumbnail[0];
				const up_thumbnail = await this.cloudinaryService.uploadFile(images_thumbnail);
				const img_thumbnail_index = {
					public_id: up_thumbnail.public_id,
					secure_url: up_thumbnail.secure_url,
				};
				// Update thumbnail db
				await this.productService.updateImageProduct(
					id,
					img_thumbnail_index.public_id,
					img_thumbnail_index.secure_url,
				);
			}
			// Check xem có list_img, nếu có thì add thêm
			if (files.list_img) {
				// upload hình lên cloud
				const uploadPromises = files.list_img.map(async (file) => {
					const upload = await this.cloudinaryService.uploadFile(file);
					return upload;
				});
				// result
				const uploads = await Promise.all(uploadPromises);
				// Xử lý kết quả trả về
				const list_img = uploads.map((item) => {
					return {
						public_id: item.public_id,
						secure_url: item.secure_url,
					};
				});
				// thêm hình ảnh vào db
				const addImgProduct = await this.productService.addImgProduct(id, list_img);
			}
			// Chỉnh sửa sản phẩm
			const updateProduct = await this.productService.updateProduct(id, productDto);
			// Chỉnh sửa sản phẩm chi tiết
			const updateProductDetail = await this.productService.updateProductDetai(id, productDto);
			// Ghi lịch sử hành động
			const log = await this.managerService.createActionHistory(
				req.user.userId,
				'update',
				id,
				null,
				`Sửa sản phẩm #${id} ${prodDetail.name_prod}`,
			);
			return res.status(HttpStatus.OK).json({ message: 'Cập nhật sản phẩm thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Xoá sản phẩm
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(JwtAuthGuard)
	@Delete('product')
	async deleteProduct(
		@Query('id') id: number,
		@Query('name') name: string,
		@Res() res: Response,
		@Req() req: User,
	) {
		try {
			const deleteProd = await this.productService.deleteProduct(id);
			// Ghi lịch sử hành động
			const log = await this.managerService.createActionHistory(
				req.user.userId,
				'delete',
				id,
				null,
				`Xoá sản phẩm ${name}`,
			);
			return res.status(HttpStatus.OK).json({ message: 'Xoá sản phẩm thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Xoá hình ảnh của sản phẩm
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(JwtAuthGuard)
	@Delete('product/image')
	async deleteImgProdut(@Query('idp') idp: string, @Res() res: Response) {
		try {
			await this.productService.delImgProd(idp);
			return res.status(HttpStatus.OK).json({ message: 'Xoá ảnh thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Tìm kiếm sản phẩm
	@Get('product/search')
	async searchProduct(@Query('name') name: string, @Res() res: Response) {
		try {
			const data = await this.productService.searchProduct(name);
			return res.status(HttpStatus.OK).json(data);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Tìm kiếm sản phẩm theo danh mục
	@Get('product/category')
	async searchProductCategory(@Query('id') id: number, @Res() res: Response) {
		try {
			const data = await this.productService.getProductByCategory(id);
			return res.status(HttpStatus.OK).json(data);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Tìm kiếm sản phẩm theo thương hiệu
	@Get('product/brand')
	async searchProductBrand(@Query('id') id: number, @Res() res: Response) {
		try {
			const data = await this.productService.getProductByBrand(id);
			return res.status(HttpStatus.OK).json(data);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Tìm kiếm sản phẩm theo khoảng giá
	@Get('product/price')
	async searchProductPrice(@Query('min') min: number, @Query('max') max: number, @Res() res: Response) {
		try {
			const data = await this.productService.getProductByPriceRange(min, max);
			return res.status(HttpStatus.OK).json(data);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Lấy tất cả sản phẩm có phân trang
	@Get('product-pag')
	async getAllProductPag(@Query('page') page: number, @Query('limit') limit: number, @Res() res: Response) {
		try {
			const data = await this.productService.findAllPagination(page, limit);
			return res.status(HttpStatus.OK).json(data);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Lấy sản phẩm ở danh sách sản phẩm admin
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(JwtAuthGuard)
	@Get('products-admin')
	async getAllProductAdmin(@Query('page') page: number, @Query('limit') limit: number, @Res() res: Response) {
		try {
			const data = await this.productService.findAllProductAdmin(page, limit);
			return res.status(HttpStatus.OK).json(data);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
