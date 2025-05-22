const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const fileTypes = /\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|mkv|webm)$/i;
        if (!file.originalname.match(fileTypes)) {
            return cb(new Error('Only image and video files are allowed!'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;
