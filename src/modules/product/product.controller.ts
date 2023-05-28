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
} from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './product.service';
import { productDto } from './dto/product.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('api')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	// Thêm sản phẩm
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
	async getProduct() {
		try {
			return 'Lấy sản phẩm chi tiết';
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Cập nhật sản phẩm
	@UseGuards(AuthGuard)
	@Patch('product')
	async updateProduct(@Query('id') id: number, @Body() productDto: productDto, @Res() res: Response) {
		try {
			// Chỉnh sửa sản phẩm
			const updateProduct = await this.productService.updateProduct(id, productDto);
			// Chỉnh sửa sản phẩm chi tiết
			const updateProductDetail = await this.productService.updateProductDetai(id, productDto);
			// Chỉnh sửa hình ảnh
			const updateImageProduct = await this.productService.updateImageProduct(id, productDto);
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
