const multer = require("multer");

const chatStorage = multer.diskStorage({
	destination: function (req: any, file: any, cb: any) {
	  cb(null, 'static/chat/')
	},
	filename: function (req: any, file: any, cb: any) {
		cb(null, file.originalname)
	},
});

const userStorage = multer.diskStorage({
	destination: function (req: any, file: any, cb: any) {
	  cb(null, 'static/user/')
	},
	filename: function (req: any, file: any, cb: any) {
		cb(null, file.originalname)
	},
});

export const chatImage = multer({ storage: chatStorage });
export const userImage = multer({ storage: userStorage });
