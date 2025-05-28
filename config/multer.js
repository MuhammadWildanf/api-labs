const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder uploads ada
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Tentukan penyimpanan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    }
});

// Perbolehkan file image dan video
const fileFilter = (req, file, cb) => {
    console.log('Attempting to upload file:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
    });

    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|webm/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (allowedTypes.test(ext) && (mime.startsWith('image/') || mime.startsWith('video/'))) {
        console.log('File accepted:', file.originalname);
        cb(null, true);
    } else {
        console.log('File rejected:', {
            filename: file.originalname,
            extension: ext,
            mimetype: mime
        });
        cb(new Error('Format file tidak diizinkan. Hanya gambar dan video.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // Maks 100MB
});

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Ukuran file terlalu besar. Maksimal 100MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    if (err.message === 'Format file tidak diizinkan. Hanya gambar dan video.') {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next(err);
};

module.exports = { upload, handleMulterError };
