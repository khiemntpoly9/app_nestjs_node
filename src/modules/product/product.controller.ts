/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { productService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: productService) {}

  @Get()
  getProduct(): string {
    return this.productService.getProduct();
  }
}
