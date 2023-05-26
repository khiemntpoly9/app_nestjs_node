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

@Injectable()
export class productService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(DeltailProd)
    private prodDetailRepository: Repository<DeltailProd>,
    @InjectRepository(ImgProduct)
    private prodImgRepository: Repository<ImgProduct>,
  ) {}

  /* Tạo sản phẩm mới */
  async createProduct(productDto: productDto): Promise<Product> {
    try {
      const product = new Product();
      product.name_prod = productDto.name_prod;
      product.id_categories = productDto.id_categories;
      product.brand_prod = productDto.brand_prod;
      product.price_prod = productDto.price_prod;
      product.material_prod = productDto.material_prod;
      product.style_prod = productDto.style_prod;
      product.img_thumbnail = productDto.img_thumbnail;
      //
      const saveProduct = await this.productRepository.save(product);
      return saveProduct;
    } catch (error) {
      throw new Error(`Error! ${error}`);
    }
  }

  /* Tạo thông tin sản phẩm */
  async createProductDetail(
    id_prod: number,
    productDto: productDto,
  ): Promise<DeltailProd> {
    try {
      const detailProd = new DeltailProd();
      detailProd.id_product = id_prod;
      detailProd.detail_prod = productDto.detail_prod;
      detailProd.description_prod = productDto.description_prod;
      detailProd.specification_prod = productDto.specification_prod;
      detailProd.preserve_prod = productDto.preserve_prod;
      // Save
      const saveProductDetail = await this.prodDetailRepository.save(
        detailProd,
      );
      return saveProductDetail;
    } catch (error) {
      throw new Error(`Error! ${error}`);
    }
  }

  // Thêm ảnh sản phẩm
  async addImgProduct(
    id_prod: number,
    productDto: productDto,
  ): Promise<ImgProduct[]> {
    try {
      const imgProducts: ImgProduct[] = [];
      for (const imgUrl of productDto.list_img) {
        const imgProd = new ImgProduct();
        imgProd.id_product = id_prod;
        imgProd.url = imgUrl;
        const saveImgProd = await this.prodImgRepository.save(imgProd);
        imgProducts.push(saveImgProd);
      }
      return imgProducts;
    } catch (error) {
      throw new Error(`Error! ${error}`);
    }
  }

  // Lấy all tất cả sản phẩm
  async findAll(): Promise<Product[]> {
    try {
      const result = await this.productRepository
        .createQueryBuilder('products')
        .leftJoinAndSelect('products.categories', 'categories')
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
          /* Detail Product */
          'detail_prod.detail_prod',
          'detail_prod.description_prod',
          'detail_prod.specification_prod',
          'detail_prod.preserve_prod',
          /* Color */
          'color.name_color',
          'color.hex_color',
        ])
        .orderBy('products.createdAt', 'DESC')
        .getMany();
      return result;
    } catch (error) {
      throw new Error(`Error! ${error}`);
    }
  }

  /* Cập nhật sản phẩm */
  async updateProduct(
    id: number,
    productDto: Partial<productDto>,
  ): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id_product: id });
    // Check
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm!');
    }
    Object.assign(product, productDto);
    return this.productRepository.save(product);
  }

  /* Cập nhật sản phẩm chi tiết */
  async updateProductDetai(
    id: number,
    productDto: Partial<productDto>,
  ): Promise<DeltailProd> {
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
      throw new Error(`Error! ${error}`);
    }
  }

  // Cập nhật hình ảnh sản phẩm
  async updateImageProduct(
    id: number,
    productDto: productDto,
  ): Promise<ImgProduct[]> {
    try {
      // Xoá các ảnh cũ của sản phẩm
      await this.prodImgRepository.delete({
        id_product: id,
      });
      // Thêm hình ảnh mới của sản phẩm
      const images = productDto.list_img.map((imgUrl) => ({
        id_product: id,
        url: imgUrl,
      }));
      await this.prodImgRepository.insert(images);
      return;
    } catch (error) {
      throw new Error(`Error! ${error}`);
    }
  }
}
