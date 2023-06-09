/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Controller,
	HttpException,
	HttpStatus,
	Res,
	Get,
	Post,
	Body,
	UseGuards,
	Patch,
	Query,
	Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { BrandService } from './brand.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { brandDto } from './dto/brand.dto';

@Controller('brand')
export class BrandController {
	constructor(private brandService: BrandService) {}

	// Lấy tất cả thương hiệu
	@Get()
	async getAllBrand(@Res() res: Response) {
		try {
			const data = await this.brandService.getAllBrand();
			return res.status(HttpStatus.OK).json(data);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Thêm thương hiệu
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(JwtAuthGuard)
	@Post()
	async createBrand(@Body() brandDto: brandDto, @Res() res: Response) {
		try {
			const createBrand = await this.brandService.createBrand(brandDto);
			return res.status(HttpStatus.OK).json({ message: 'Tạo thương hiệu thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Sửa thương hiệu
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(JwtAuthGuard)
	@Patch()
	async updateBrand(@Query('id') id: number, @Body() brandDto: brandDto, @Res() res: Response) {
		try {
			const updateBrand = await this.brandService.updateBrand(id, brandDto);
			return res.status(HttpStatus.OK).json({ message: 'Cập nhật thương hiệu thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Xóa thương hiệu
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(JwtAuthGuard)
	@Delete()
	async deleteBrand(@Query('id') id: number, @Res() res: Response) {
		try {
			const deleteBrand = await this.brandService.deleteBrand(id);
			return res.status(HttpStatus.OK).json({ message: 'Xóa thương hiệu thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
