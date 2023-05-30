export const MulterOptions = {
	limits: {
		fieldSize: 2000000,
	},
	fileFilter: (req, file, callback) => {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
			return callback(new Error('Invalid file format.'), false);
		}
		callback(null, true);
	},
};
