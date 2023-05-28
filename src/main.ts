/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// CORS
	app.enableCors({
		origin: 'http://localhost:3001',
		credentials: true,
	});
	// Cookie Parser
	app.use(cookieParser());
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
	// app.useLogger(new Logger(null, { timestamp: false }));
	await app.listen(process.env.PORT || 3000);
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
