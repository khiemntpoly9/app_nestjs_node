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
} from '@nestjs/common';
import { Response } from 'express';
import { productService } from './product.service';
import { productDto } from './dto/product.dto';

@Controller('api')
export class ProductController {
  constructor(private readonly productService: productService) {}

  // Thêm sản phẩm
  @Post('product')
  async createProduct(@Body() productDto: productDto, @Res() res: Response) {
    try {
      // Tạo sản phẩm
      const createProduct = await this.productService.createProduct(productDto);
      const newProductId = createProduct.id_product;
      //  Tạo thông tin sản phẩm
      const createProductDetail = await this.productService.createProductDetail(
        newProductId,
        productDto,
      );
      // Thêm hình ảnh sản phẩm
      const addImgProduct = await this.productService.addImgProduct(
        newProductId,
        productDto,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Tạo sản phẩm thành công!' });
    } catch (error) {
      const errorMessage = 'Có lỗi xảy ra';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy tất cả sản phẩm
  @Get('products')
  async getAllProduct(@Res() res: Response) {
    try {
      const data = await this.productService.findAll();
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      const errorMessage = 'Có lỗi xảy ra';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy chi tiết sản phẩm
  @Get('product')
  async getProduct() {
    try {
      return 'Lấy sản phẩm chi tiết';
    } catch (error) {
      const errorMessage = 'Có lỗi xảy ra';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Cập nhật sản phẩm
  @Patch('product')
  async updateProduct(
    @Query('id') id: number,
    @Body() productDto: productDto,
    @Res() res: Response,
  ) {
    try {
      // Chỉnh sửa sản phẩm
      const updateProduct = await this.productService.updateProduct(
        id,
        productDto,
      );
      // Chỉnh sửa sản phẩm chi tiết
      const updateProductDetail = await this.productService.updateProductDetai(
        id,
        productDto,
      );
      // Chỉnh sửa hình ảnh
      const updateImageProduct = await this.productService.updateImageProduct(
        id,
        productDto,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Cập nhật sản phẩm thành công!' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
