/**
 * Helper functions for Google Cloud Platform Storage
 */

/**
 * Extract file path from GCP Storage URL
 * @param {string} url - GCP Storage public URL
 * @returns {string} - File path in bucket
 */
function extractGcpPath(url) {
    if (!url || !url.includes('storage.googleapis.com')) {
        return null;
    }

    const urlParts = url.split('/');
    // Remove https://storage.googleapis.com/bucket-name/
    return urlParts.slice(4).join('/');
}

/**
 * Check if URL is a GCP Storage URL
 * @param {string} url - URL to check
 * @returns {boolean} - True if GCP Storage URL
 */
function isGcpUrl(url) {
    return url && url.includes('storage.googleapis.com');
}

/**
 * Generate public URL for GCP Storage file
 * @param {string} bucketName - GCP bucket name
 * @param {string} filePath - File path in bucket
 * @returns {string} - Public URL
 */
function generateGcpUrl(bucketName, filePath) {
    return `https://storage.googleapis.com/${bucketName}/${filePath}`;
}

module.exports = {
    extractGcpPath,
    isGcpUrl,
    generateGcpUrl
}; 