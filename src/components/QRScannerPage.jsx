import { useNavigate } from 'react-router-dom';
import QRScanner from './QRScanner';
import { parseQRData } from '../lib/qrHelpers';
import '../styles/QRScannerPage.css';

/**
 * Full-screen QR Scanner Page
 * Scans QR codes and navigates to bag detail
 */
export default function QRScannerPage() {
  const navigate = useNavigate();

  const handleScanSuccess = (decodedText) => {
    try {
      // Parse and validate QR code
      const qrData = parseQRData(decodedText);
      
      if (qrData && qrData.bagId) {
        // Navigate to bag detail page
        navigate(`/load/bag/${qrData.bagId}`);
      } else {
        alert('Invalid QR code. Please scan a JambonRider bag QR code.');
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      alert('Failed to read QR code. Please try again.');
    }
  };

  const handleScanError = (error) => {
    console.error('QR scan error:', error);
  };

  const handleCancel = () => {
    navigate('/load');
  };

  return (
    <div className="qr-scanner-page">
      <div className="qr-scanner-header">
        <h1>Scan Bag QR Code</h1>
        <button 
          className="cancel-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>

      <div className="qr-scanner-content">
        <QRScanner 
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
        />
      </div>

      <div className="qr-scanner-footer">
        <p>Scan the QR code on a bag label to view its contents</p>
      </div>
    </div>
  );
}
