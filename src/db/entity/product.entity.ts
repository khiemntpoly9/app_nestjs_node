/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	JoinColumn,
	OneToOne,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { Category } from './categories.entity';
import { Brand } from './brand.entity';
import { ImgProduct } from './imageproduct.entity';
import { DeltailProd } from './detail_prod.entity';
import { Color } from './color.entity';
import { User } from './user.entity';
import { Favorites } from './favotites.entity';

@Entity({ name: 'products' })
export class Product {
	@PrimaryGeneratedColumn({ type: 'int' })
	id_product: number;

	@Column({ type: 'varchar', length: 255, nullable: false })
	name_prod: string;

	@Column({ type: 'int', name: 'id_categories', nullable: false })
	id_categories: number;

	@Column({ type: 'int' })
	brand_prod: number;

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
	price_prod: number;

	@Column({ type: 'int' })
	material_prod: number;

	@Column({ type: 'int' })
	style_prod: number;

	@Column({ type: 'varchar', length: 255 })
	img_thumbnail: string;

	@Column({ type: 'varchar', length: 255 })
	public_id: string;

	@Column({ type: 'int' })
	discount: number;

	@CreateDateColumn({
		name: 'createdAt',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
	})
	createdAt: Date;

	@UpdateDateColumn({
		name: 'updatedAt',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
	})
	updatedAt: Date;

	// Danh mục sản phẩm
	@ManyToOne(() => Category, (category) => category.product)
	@JoinColumn({ name: 'id_categories' })
	categories: Category;

	// Thương hiệu sản phẩm
	@ManyToOne(() => Brand, (brand) => brand.product)
	@JoinColumn({ name: 'brand_prod' })
	brands: Brand;

	// Hình ảnh sản phẩm
	@OneToMany(() => ImgProduct, (img_prod) => img_prod.product)
	img_prod: ImgProduct[];

	// Thông tin sản phẩm
	@OneToOne(() => DeltailProd, (detailProd) => detailProd.product)
	detail_prod: DeltailProd;

	// Màu sản phẩm
	@ManyToMany(() => Color, (color) => color.product, { cascade: true })
	@JoinTable({
		name: 'product_color',
		joinColumn: { name: 'product_id', referencedColumnName: 'id_product' },
		inverseJoinColumn: { name: 'color_id', referencedColumnName: 'id_color' },
	})
	color: Color[];

	// Mối quan hệ favorites
	@OneToMany(() => Favorites, (favorites) => favorites.product)
	favorites: Favorites[];
}
