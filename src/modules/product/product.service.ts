/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Product } from 'src/interfaces/product.interface';

@Injectable()
export class productService {
  private readonly product: Product[] = [];

  getProduct() {
    return 'Lấy thông tin sản phẩm 123@';
  }
}
