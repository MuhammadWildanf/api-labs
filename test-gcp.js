/**
 * Test script untuk memverifikasi konfigurasi GCP Storage
 * Run dengan: node test-gcp.js
 */

require('dotenv').config();
const gcpStorage = require('./config/gcp-storage');
const { isGcpUrl, extractGcpPath, generateGcpUrl } = require('./helpers/gcp-utils');

async function testGcpConfiguration() {
    console.log('=== Testing GCP Storage Configuration ===\n');

    // Test 1: Check if GCP is configured
    console.log('1. Checking GCP Configuration...');
    if (gcpStorage.isConfigured()) {
        console.log('✅ GCP is properly configured');
        console.log(`   Project ID: ${process.env.GOOGLE_CLOUD_PROJECT_ID}`);
        console.log(`   Bucket Name: ${process.env.GOOGLE_CLOUD_BUCKET_NAME}`);
        console.log(`   Key File: ${process.env.GOOGLE_CLOUD_KEY_FILE || './gcp-key.json'}`);
    } else {
        console.log('❌ GCP is not configured');
        console.log('   Missing environment variables or key file');
        console.log('   System will fallback to local storage');
        return;
    }

    // Test 2: Test helper functions
    console.log('\n2. Testing Helper Functions...');

    const testUrl = 'https://storage.googleapis.com/test-bucket/folder/file.jpg';
    console.log(`   Test URL: ${testUrl}`);
    console.log(`   Is GCP URL: ${isGcpUrl(testUrl)}`);
    console.log(`   Extracted Path: ${extractGcpPath(testUrl)}`);

    const generatedUrl = generateGcpUrl('test-bucket', 'folder/file.jpg');
    console.log(`   Generated URL: ${generatedUrl}`);

    // Test 3: Test bucket connection
    console.log('\n3. Testing Bucket Connection...');
    try {
        const [exists] = await gcpStorage.bucket.exists();
        if (exists) {
            console.log('✅ Bucket connection successful');
        } else {
            console.log('❌ Bucket does not exist');
        }
    } catch (error) {
        console.log('❌ Bucket connection failed');
        console.log(`   Error: ${error.message}`);
    }

    // Test 4: Test file operations (if bucket exists)
    console.log('\n4. Testing File Operations...');
    try {
        const [exists] = await gcpStorage.bucket.exists();
        if (exists) {
            // Test file generation
            const fileName = gcpStorage.generateFileName('test.jpg', 'test');
            console.log(`   Generated filename: ${fileName}`);

            // Test file existence check
            const file = gcpStorage.bucket.file(fileName);
            const [fileExists] = await file.exists();
            console.log(`   File exists: ${fileExists}`);

            if (!fileExists) {
                console.log('   ✅ File operations test passed (file doesn\'t exist as expected)');
            }
        } else {
            console.log('   ⚠️  Skipping file operations test (bucket not accessible)');
        }
    } catch (error) {
        console.log('❌ File operations test failed');
        console.log(`   Error: ${error.message}`);
    }

    console.log('\n=== Test Complete ===');
}

// Run the test
testGcpConfiguration().catch(console.error); 