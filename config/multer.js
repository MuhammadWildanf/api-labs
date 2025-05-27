const multer = require('multer');
const path = require('path');

// Tentukan penyimpanan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Pastikan folder ada
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    }
});

// Perbolehkan file image dan video
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|webm/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (allowedTypes.test(ext) && (mime.startsWith('image/') || mime.startsWith('video/'))) {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak diizinkan. Hanya gambar dan video.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // Maks 100MB (atur sesuai kebutuhan)
});

module.exports = upload;
