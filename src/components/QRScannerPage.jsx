import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import QRScanner from './QRScanner';
import { parseQRData } from '../lib/qrHelpers';
import '../styles/QRScannerPage.css';

/**
 * Full-screen QR Scanner Page
 * Scans QR codes and navigates to bag detail
 */
export default function QRScannerPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const hasNavigatedRef = useRef(false);

  const handleScanSuccess = (decodedText) => {
    // Prevent multiple scans
    if (isProcessing || hasNavigatedRef.current) return;
    
    setIsProcessing(true);
    hasNavigatedRef.current = true;
    
    try {
      // Parse and validate QR code
      const qrData = parseQRData(decodedText);
      
      if (qrData && qrData.bagId) {
        // Navigate to bag detail page with replace to avoid back button issues
        navigate(`/load/bag/${qrData.bagId}`, { replace: true });
      } else {
        alert('Invalid QR code. Please scan a JambonRider bag QR code.');
        setIsProcessing(false);
        hasNavigatedRef.current = false;
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      alert('Failed to read QR code. Please try again.');
      setIsProcessing(false);
      hasNavigatedRef.current = false;
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
