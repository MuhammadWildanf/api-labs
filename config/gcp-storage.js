const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs').promises;

class GCPStorage {
    constructor() {
        this.isConfiguredFlag = this.checkConfiguration();

        if (this.isConfiguredFlag) {
            // Inisialisasi Google Cloud Storage
            this.storage = new Storage({
                keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE || path.join(__dirname, '../gcp-key.json'),
                projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
            });

            this.bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
            this.bucket = this.storage.bucket(this.bucketName);
        }
    }

    // Check if GCP is properly configured
    checkConfiguration() {
        const hasProjectId = !!process.env.GOOGLE_CLOUD_PROJECT_ID;
        const hasBucketName = !!process.env.GOOGLE_CLOUD_BUCKET_NAME;
        const hasKeyFile = !!(process.env.GOOGLE_CLOUD_KEY_FILE ||
            fs.access(path.join(__dirname, '../gcp-key.json')).then(() => true).catch(() => false));

        return hasProjectId && hasBucketName && hasKeyFile;
    }

    // Check if GCP is properly configured
    isConfigured() {
        return this.isConfiguredFlag;
    }

    // Upload file ke GCP Storage
    async uploadFile(file, destinationPath) {
        if (!this.isConfigured()) {
            throw new Error('GCP Storage is not configured');
        }

        try {
            const fileBuffer = await fs.readFile(file.path);

            const fileUpload = this.bucket.file(destinationPath);

            const stream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
                resumable: false
            });

            return new Promise((resolve, reject) => {
                stream.on('error', (err) => {
                    console.error('Error uploading to GCP:', err);
                    reject(err);
                });

                stream.on('finish', async () => {
                    try {
                        // Set file to be publicly readable
                        await fileUpload.makePublic();

                        // Get public URL
                        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${destinationPath}`;

                        // Delete local file after successful upload
                        await fs.unlink(file.path);

                        resolve({
                            url: publicUrl,
                            filename: path.basename(destinationPath),
                            mimetype: file.mimetype,
                            size: file.size
                        });
                    } catch (err) {
                        console.error('Error making file public or deleting local file:', err);
                        reject(err);
                    }
                });

                stream.end(fileBuffer);
            });
        } catch (err) {
            console.error('Error in uploadFile:', err);
            throw err;
        }
    }

    // Delete file dari GCP Storage
    async deleteFile(filePath) {
        if (!this.isConfigured()) {
            throw new Error('GCP Storage is not configured');
        }

        try {
            const file = this.bucket.file(filePath);
            await file.delete();
            console.log(`File ${filePath} deleted from GCP Storage`);
        } catch (err) {
            console.error('Error deleting file from GCP:', err);
            // Don't throw error if file doesn't exist
            if (err.code !== 404) {
                throw err;
            }
        }
    }

    // Generate unique filename
    generateFileName(originalName, fieldName) {
        const ext = path.extname(originalName);
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        return `${fieldName}/${timestamp}-${randomString}${ext}`;
    }
}

module.exports = new GCPStorage(); 