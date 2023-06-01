/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
/** */
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/product/product.module';
import { dataSourceOptions } from './db/data-source';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { CategoriesModule } from './modules/categories/categories.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { MailModule } from './modules/mail/mail.module';
/* */

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(dataSourceOptions),
		ProductModule,
		UserModule,
		AuthModule,
		CategoriesModule,
		CloudinaryModule,
		MailModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoggerMiddleware)
			.exclude(
				{ path: 'api/login', method: RequestMethod.POST },
				{ path: 'api/logout', method: RequestMethod.POST },
			)
			.forRoutes({ path: '*', method: RequestMethod.ALL });
	}
	constructor(private dataSource: DataSource) {}
}
