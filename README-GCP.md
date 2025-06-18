# Google Cloud Platform Storage Integration

Implementasi penyimpanan file upload ke Google Cloud Storage untuk API Labs.

## Fitur

- ✅ Upload file ke GCP Storage
- ✅ Fallback ke local storage jika GCP tidak dikonfigurasi
- ✅ Otomatis delete file lama saat update
- ✅ Support untuk thumbnail dan media files
- ✅ File organization dalam bucket (thumbnails/, media/, temp/)
- ✅ Public URL generation
- ✅ Error handling dan cleanup

## File yang Diperbarui

### 1. Dependencies
- `package.json` - Menambahkan `@google-cloud/storage`

### 2. Konfigurasi
- `config/gcp-storage.js` - Konfigurasi GCP Storage
- `helpers/gcp-utils.js` - Helper functions untuk GCP

### 3. Controller
- `controllers/product.js` - Update semua fungsi upload/delete untuk menggunakan GCP

### 4. Dokumentasi
- `gcp-setup.md` - Panduan setup GCP
- `env.example` - Contoh environment variables
- `.gitignore` - Menambahkan `gcp-key.json`

## Cara Penggunaan

### 1. Setup GCP
Ikuti panduan di `gcp-setup.md` untuk:
- Membuat project GCP
- Membuat bucket
- Membuat service account
- Download key file

### 2. Konfigurasi Environment
Copy `env.example` ke `.env` dan isi dengan konfigurasi GCP:

```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
GOOGLE_CLOUD_KEY_FILE=./gcp-key.json
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Test Upload
Upload file melalui API dan cek apakah file muncul di GCP bucket.

## Struktur File di GCP Bucket

```
bucket-name/
├── thumbnails/
│   ├── 1703123456789-abc123.jpg
│   └── 1703123456790-def456.png
├── media/
│   ├── 1703123456791-ghi789.mp4
│   ├── 1703123456792-jkl012.jpg
│   └── 1703123456793-mno345.png
└── temp/
    └── (temporary files during upload)
```

## Fallback Behavior

Jika GCP tidak dikonfigurasi (missing environment variables atau key file), sistem akan otomatis menggunakan local storage di folder `uploads/`.

## API Endpoints yang Mendukung GCP

### Product Management
- `POST /products` - Create product dengan thumbnail dan media
- `PUT /products/:id` - Update product dengan thumbnail dan media
- `DELETE /products/:id` - Delete product dan semua file terkait

### Media Management
- `POST /products/:id/media` - Add media files
- `DELETE /products/:id/media/:mediaId` - Delete specific media file
- `PUT /products/:id/media/reorder` - Reorder media files

## Error Handling

- File upload error akan otomatis cleanup file yang sudah diupload
- GCP connection error akan fallback ke local storage
- Invalid file type akan ditolak sebelum upload

## Security

- Service account key file (`gcp-key.json`) tidak akan di-commit ke git
- File di GCP bucket dibuat public untuk akses langsung
- Environment variables digunakan untuk konfigurasi sensitif

## Monitoring

- Log upload/delete operations di console
- Error handling untuk semua operasi GCP
- Fallback logging untuk local storage

## Troubleshooting

### GCP Not Working
1. Check environment variables
2. Verify service account key file
3. Check bucket permissions
4. Ensure GCP APIs are enabled

### File Not Uploading
1. Check file size limits
2. Verify file type restrictions
3. Check network connectivity
4. Review console logs

### File Not Accessible
1. Check bucket public access settings
2. Verify file permissions
3. Check URL format

## Performance

- Files diupload langsung ke GCP tanpa intermediate storage
- Local files dihapus setelah successful upload
- Batch operations untuk multiple files
- Async operations untuk better performance 