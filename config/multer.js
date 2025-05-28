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
        console.log('Multer storage destination called for file:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype
        });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${file.fieldname}${ext}`;
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
});

// Perbolehkan file image dan video
const fileFilter = (req, file, cb) => {
    console.log('File filter checking:', {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
    });

    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|webm/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    console.log('File details:', {
        extension: ext,
        mimetype: mime,
        isAllowedExtension: allowedTypes.test(ext),
        isImageOrVideo: mime.startsWith('image/') || mime.startsWith('video/')
    });

    if (allowedTypes.test(ext) && (mime.startsWith('image/') || mime.startsWith('video/'))) {
        console.log('File accepted:', file.originalname);
        cb(null, true);
    } else {
        console.log('File rejected:', {
            filename: file.originalname,
            extension: ext,
            mimetype: mime,
            reason: !allowedTypes.test(ext) ? 'Extension not allowed' : 'Mimetype not allowed'
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
    console.error('Multer error occurred:', {
        error: err,
        message: err.message,
        code: err.code,
        field: err.field
    });

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
