import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

/**
 * QR Code Scanner Component
 * Uses device camera to scan QR codes
 */
export default function QRScanner({ onScanSuccess, onScanError }) {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    // Check for HTTPS on mobile
    const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    
    if (!isSecureContext && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      setError('Camera access requires HTTPS on mobile devices. Please deploy the app or use a secure connection.');
      return;
    }

    // Initialize scanner
    const startScanner = async () => {
      try {
        // Request camera permission explicitly first
        try {
          await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: { ideal: 'environment' } } 
          }).then(stream => {
            // Stop the stream immediately - we just needed permission
            stream.getTracks().forEach(track => track.stop());
          });
        } catch (permErr) {
          throw new Error('Camera permission denied. Please allow camera access in your browser settings.');
        }

        const html5QrCode = new Html5Qrcode('qr-reader');
        html5QrCodeRef.current = html5QrCode;

        // Get available cameras
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          // Prefer back camera on mobile devices
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment')
          );
          const cameraId = backCamera ? backCamera.id : devices[0].id;

          // Start scanning with better mobile config
          await html5QrCode.start(
            cameraId,
            {
              fps: 10,
              qrbox: function(viewfinderWidth, viewfinderHeight) {
                // Make responsive scanning box
                const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                const qrboxSize = Math.floor(minEdge * 0.7);
                return { width: qrboxSize, height: qrboxSize };
              },
              aspectRatio: 1.0,
              videoConstraints: {
                facingMode: { ideal: 'environment' },
                advanced: [{ focusMode: 'continuous' }]
              }
            },
            (decodedText) => {
              // Success callback
              if (onScanSuccess) {
                onScanSuccess(decodedText);
              }
            },
            (errorMessage) => {
              // Error callback (fires continuously while scanning, so we don't show these)
              // Only show errors in onScanError prop if provided
            }
          );

          setIsScanning(true);
          setError(null);
        } else {
          setError('No cameras found. Please ensure your device has a camera and you have granted camera permissions.');
        }
      } catch (err) {
        console.error('Failed to start QR scanner:', err);
        
        let errorMessage = 'Failed to start camera. ';
        
        if (err.message.includes('permission')) {
          errorMessage += 'Camera permission denied. Please allow camera access in your browser settings.';
        } else if (err.name === 'NotAllowedError') {
          errorMessage += 'Camera permission denied. Please allow camera access and reload the page.';
        } else if (err.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (err.name === 'NotReadableError') {
          errorMessage += 'Camera is already in use by another application.';
        } else {
          errorMessage += err.message || 'Unknown error occurred.';
        }
        
        setError(errorMessage);
        if (onScanError) {
          onScanError(err);
        }
      }
    };

    startScanner();

    // Cleanup
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(err => {
          console.error('Error stopping scanner:', err);
        }).finally(() => {
          html5QrCodeRef.current = null;
        });
      }
    };
  }, []); // Empty deps - only initialize once

  return (
    <div className="qr-scanner-container">
      {error && (
        <div className="qr-scanner-error" style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <p style={{ color: '#c00', margin: 0, textAlign: 'center' }}>
            ⚠️ {error}
          </p>
          {error.includes('HTTPS') && (
            <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.5rem', textAlign: 'center' }}>
              For testing: Access via <code>localhost</code> or deploy to production (Vercel uses HTTPS automatically)
            </p>
          )}
        </div>
      )}
      
      <div id="qr-reader" ref={scannerRef} style={{ width: '100%' }}></div>
      
      {isScanning && (
        <div className="qr-scanner-instructions" style={{ 
          textAlign: 'center', 
          padding: '1rem',
          color: '#666'
        }}>
          <p>📸 Position the QR code within the frame</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Hold steady for best results
          </p>
        </div>
      )}
    </div>
  );
}
