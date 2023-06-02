import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
	secret: process.env.JWT_SECRET,
};

export const jwtVerify = {
	secret: process.env.JWT_VERIFY,
};
