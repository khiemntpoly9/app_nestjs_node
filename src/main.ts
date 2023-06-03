/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ['error', 'warn', 'debug', 'verbose'],
	});
	// CORS
	app.enableCors({
		origin: 'http://localhost:3001',
		credentials: true,
	});
	// Cookie Parser
	app.use(cookieParser());
	//
	app.setGlobalPrefix('api');
	/* */
	const config = new DocumentBuilder()
		.setTitle('GachaShop API')
		.setDescription('The GachaShop API description')
		.setVersion('1.0')
		// .addTag('cats')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document);
	await app.listen(process.env.PORT || 3000);
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
