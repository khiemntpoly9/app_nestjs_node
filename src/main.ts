/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// Cookie Parser
	// app.use(cookieParser());
	/* */
	const config = new DocumentBuilder()
		.setTitle('GachaShop API')
		.setDescription('The GachaShop API description')
		.setVersion('1.0')
		// .addTag('cats')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document);
	/* */
	await app.listen(process.env.PORT || 3000);
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
