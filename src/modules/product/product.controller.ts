/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
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
} from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './product.service';
import { productDto } from './dto/product.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MulterOptions } from './multerOption';

@Controller('api')
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private cloudinaryService: CloudinaryService,
	) {}

	// Thêm sản phẩm test
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(AuthGuard)
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
			return res.status(HttpStatus.OK).json({ message: 'Tạo sản phẩm thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Thêm sản phẩm
	/*
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(AuthGuard)
	@Post('product')
	async createProduct(@Body() productDto: productDto, @Res() res: Response) {
		try {
			// Tạo sản phẩm
			const createProduct = await this.productService.createProduct(productDto);
			const newProductId = createProduct.id_product;
			//  Tạo thông tin sản phẩm
			const createProductDetail = await this.productService.createProductDetail(newProductId, productDto);
			// Thêm hình ảnh sản phẩm
			const addImgProduct = await this.productService.addImgProduct(newProductId, productDto);
			return res.status(HttpStatus.OK).json({ message: 'Tạo sản phẩm thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	*/

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
	@UseGuards(AuthGuard)
	@Patch('product')
	async updateProduct(@Query('id') id: number, @Body() productDto: productDto, @Res() res: Response) {
		try {
			// Chỉnh sửa sản phẩm
			const updateProduct = await this.productService.updateProduct(id, productDto);
			// Chỉnh sửa sản phẩm chi tiết
			const updateProductDetail = await this.productService.updateProductDetai(id, productDto);
			// Chỉnh sửa hình ảnh
			// const updateImageProduct = await this.productService.updateImageProduct(id, productDto);
			return res.status(HttpStatus.OK).json({ message: 'Cập nhật sản phẩm thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Xoá sản phẩm
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(AuthGuard)
	@Delete('product')
	async deleteProduct(@Query('id') id: number, @Res() res: Response) {
		try {
			const deleteProd = await this.productService.deleteProduct(id);
			return res.status(HttpStatus.OK).json({ message: 'Xoá sản phẩm thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
