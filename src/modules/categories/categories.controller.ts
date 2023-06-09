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
import { CategoriesService } from './categories.service';
import { categoryDto } from './dto/categories.dto';
import { Response } from 'express';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
	constructor(private categoriesService: CategoriesService) {}

	// Lấy tất cả danh mục
	@Get()
	async getAllCategories(@Res() res: Response) {
		try {
			const data = await this.categoriesService.getAllCategories();
			return res.status(HttpStatus.OK).json(data);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Thêm danh mục
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(JwtAuthGuard)
	@Post()
	async createCategory(@Body() categoryDto: categoryDto, @Res() res: Response) {
		try {
			const createCategory = await this.categoriesService.createCategories(categoryDto);
			return res.status(HttpStatus.OK).json({ message: 'Tạo danh mục thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Sửa danh mục
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(JwtAuthGuard)
	@Patch()
	async updateCategory(@Query('id') id: number, @Body() categoryDto: categoryDto, @Res() res: Response) {
		try {
			const updateCategory = await this.categoriesService.updateCategories(id, categoryDto);
			return res.status(HttpStatus.OK).json({ message: 'Cập nhật danh mục thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Xoá danh mục
	@Roles(Role.QTV, Role.CTV)
	@UseGuards(JwtAuthGuard)
	@Delete()
	async deleteCategory(@Query('id') id: number, @Res() res: Response) {
		try {
			const deleteCategory = await this.categoriesService.deleteCategories(id);
			return res.status(HttpStatus.OK).json({ message: 'Xoá danh mục thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
