/* eslint-disable @typescript-eslint/no-unused-vars */
// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
	// Upload ảnh
	uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
		return new Promise<CloudinaryResponse>((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
				if (error) return reject(error);
				resolve(result);
			});

			streamifier.createReadStream(file.buffer).pipe(uploadStream);
		});
	}
	// Xoá hình ảnh
	deleteFile(public_id: string): Promise<CloudinaryResponse> {
		return new Promise<CloudinaryResponse>((resolve, reject) => {
			const deleteFile = cloudinary.uploader.destroy(public_id, (error, result) => {
				if (error) return reject(error);
				resolve(result);
			});
		});
	}
}
