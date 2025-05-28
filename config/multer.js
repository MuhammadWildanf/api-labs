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

// Filter untuk gambar
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Filter untuk video
const videoFilter = (req, file, cb) => {
    const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed!'), false);
    }
};

// Filter untuk gambar dan video
const mediaFilter = (req, file, cb) => {
    console.log('Media filter checking:', {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer ? 'Buffer exists' : 'No buffer',
        encoding: file.encoding
    });

    const allowedTypes = {
        'image/jpeg': true,
        'image/png': true,
        'image/gif': true,
        'video/mp4': true,
        'video/quicktime': true,
        'video/x-msvideo': true,
        'video/webm': true
    };

    console.log('Checking MIME type:', {
        receivedMimeType: file.mimetype,
        isAllowed: allowedTypes[file.mimetype] ? 'Yes' : 'No',
        allowedTypes: Object.keys(allowedTypes)
    });

    if (allowedTypes[file.mimetype]) {
        console.log('File accepted:', {
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        });
        cb(null, true);
    } else {
        console.log('File rejected:', {
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            reason: 'MIME type not allowed'
        });
        cb(new Error('Format file tidak diizinkan. Hanya gambar dan video.'), false);
    }
};

// Konfigurasi upload untuk gambar
const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Konfigurasi upload untuk video
const uploadVideo = multer({
    storage,
    fileFilter: videoFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// Konfigurasi upload untuk media (gambar dan video)
const uploadMedia = multer({
    storage,
    fileFilter: mediaFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
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

module.exports = {
    uploadImage,
    uploadVideo,
    uploadMedia,
    handleMulterError
};
