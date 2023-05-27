/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
/** */
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/product/product.module';
import { dataSourceOptions } from './db/data-source';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
/* */

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(dataSourceOptions),
		ProductModule,
		UserModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}
