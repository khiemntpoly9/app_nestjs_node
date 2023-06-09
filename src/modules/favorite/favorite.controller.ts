// Favorite Controller
import {
	Controller,
	Get,
	Post,
	Body,
	Delete,
	UseGuards,
	Res,
	Req,
	Query,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

interface User extends Request {
	user: {
		userId: number;
		email: string;
		role: string;
	};
}

@Controller('favorite')
export class FavoriteController {
	constructor(private readonly favoriteService: FavoriteService) {}

	// Thêm sản phẩm vào danh sách yêu thích
	@Roles(Role.User, Role.CTV, Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Post()
	async create(@Body() createFavoriteDto: CreateFavoriteDto, @Res() res: Response, @Req() req: User) {
		if (!req.user) return res.status(400).json({ message: 'Bạn chưa đăng nhập!' });
		try {
			await this.favoriteService.create(createFavoriteDto, req.user.userId);
			return res.status(201).json({ message: 'Thêm sản phẩm vào danh sách yêu thích thành công!' });
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	}

	// Lấy tất cả sản phẩm yêu thích
	@Roles(Role.User, Role.CTV, Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Get()
	findAll(@Req() req: User) {
		return this.favoriteService.getFavoriteUser(req.user.userId);
	}

	// Xóa 1 sản phẩm yêu thích
	@Roles(Role.User, Role.CTV, Role.QTV)
	@UseGuards(JwtAuthGuard)
	@Delete()
	async remove(@Query('id_prod') id: number, @Req() req: User, @Res() res: Response) {
		try {
			await this.favoriteService.deleteFavorite(id, req.user.userId);
			return res.status(HttpStatus.OK).json({ message: 'Xoá yêu thích thành công!' });
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
