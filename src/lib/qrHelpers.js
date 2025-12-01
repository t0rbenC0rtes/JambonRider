import QRCode from 'qrcode';

/**
 * Generate QR code data for a bag
 * @param {string} bagId - The bag ID
 * @returns {object} - QR data object
 */
export const generateQRData = (bagId) => {
  return {
    app: 'jambonrider',
    bagId: bagId,
    timestamp: new Date().toISOString()
  };
};

/**
 * Generate QR code as a data URL
 * @param {string} bagId - The bag ID
 * @returns {Promise<string>} - Data URL of QR code image
 */
export const generateQRCodeDataURL = async (bagId) => {
  const qrData = generateQRData(bagId);
  const dataString = JSON.stringify(qrData);
  
  try {
    const url = await QRCode.toDataURL(dataString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff'
      }
    });
    return url;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

/**
 * Generate QR code as a blob for upload
 * @param {string} bagId - The bag ID
 * @returns {Promise<Blob>} - QR code image as blob
 */
export const generateQRCodeBlob = async (bagId) => {
  const dataURL = await generateQRCodeDataURL(bagId);
  
  // Convert data URL to blob
  const response = await fetch(dataURL);
  const blob = await response.blob();
  
  return blob;
};

/**
 * Parse QR code data
 * @param {string} qrString - The scanned QR string
 * @returns {object|null} - Parsed QR data or null if invalid
 */
export const parseQRData = (qrString) => {
  try {
    const data = JSON.parse(qrString);
    
    // Validate it's from our app
    if (data.app === 'jambonrider' && data.bagId) {
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Invalid QR code format:', error);
    return null;
  }
};
