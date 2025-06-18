# Setup Google Cloud Platform Storage

## Prerequisites

1. Google Cloud Platform account
2. Google Cloud Storage bucket
3. Service account key file

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google Cloud Storage API

### 2. Create Storage Bucket

1. Go to Cloud Storage > Buckets
2. Click "Create Bucket"
3. Choose a unique name for your bucket
4. Configure settings:
   - Location: Choose nearest to your users
   - Storage class: Standard
   - Access control: Fine-grained
   - Protection tools: None (for now)

### 3. Create Service Account

1. Go to IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Fill in details:
   - Name: `api-labs-storage`
   - Description: `Service account for API Labs file storage`
4. Click "Create and Continue"
5. Grant roles:
   - Storage Object Admin
   - Storage Object Viewer
6. Click "Done"

### 4. Generate Service Account Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose JSON format
5. Download the key file
6. Rename to `gcp-key.json` and place in project root

### 5. Configure Environment Variables

Create `.env` file in project root:

```env
# Google Cloud Platform Configuration
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
GOOGLE_CLOUD_KEY_FILE=./gcp-key.json
```

### 6. Install Dependencies

```bash
npm install @google-cloud/storage
```

## File Structure

Files will be organized in the bucket as follows:

```
bucket-name/
├── thumbnails/
│   ├── timestamp-randomstring.jpg
│   └── ...
├── media/
│   ├── timestamp-randomstring.mp4
│   ├── timestamp-randomstring.jpg
│   └── ...
└── temp/
    └── (temporary files during upload)
```

## Security Notes

1. **Never commit `gcp-key.json` to version control**
2. Add `gcp-key.json` to `.gitignore`
3. Use environment variables for sensitive data
4. Consider using Google Cloud KMS for additional security

## Fallback Behavior

If GCP is not configured (missing environment variables or key file), the system will fallback to local storage in the `uploads/` directory.

## Testing

1. Set up environment variables
2. Place `gcp-key.json` in project root
3. Start the server
4. Upload a file through the API
5. Check if file appears in your GCP bucket

## Troubleshooting

### Common Issues

1. **Authentication Error**: Check if service account key is valid and has proper permissions
2. **Bucket Not Found**: Verify bucket name and project ID
3. **Permission Denied**: Ensure service account has Storage Object Admin role
4. **File Not Public**: Files are automatically made public, check bucket permissions

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=gcp-storage
```

## Cost Optimization

1. Use appropriate storage classes
2. Set up lifecycle policies to move old files to cheaper storage
3. Monitor usage in Google Cloud Console
4. Consider using signed URLs for private files 