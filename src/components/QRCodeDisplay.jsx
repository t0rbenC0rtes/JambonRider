import { QRCodeSVG } from 'qrcode.react';
import { generateQRData } from '../lib/qrHelpers';

/**
 * QR Code Display Component
 * Shows QR code for a bag in admin view with download option
 */
export default function QRCodeDisplay({ bag }) {
  if (!bag) return null;

  const qrData = generateQRData(bag.id);

  const handleDownload = () => {
    // Get the SVG element
    const svg = document.getElementById(`qr-code-${bag.id}`);
    if (!svg) return;

    // Convert SVG to blob
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    
    // Create download link
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-${bag.name.replace(/\s+/g, '-').toLowerCase()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="qr-code-display">
      <h3>QR Code</h3>
      <div className="qr-code-container">
        {bag.qrCode ? (
          <>
            <img 
              src={bag.qrCode} 
              alt={`QR code for ${bag.name}`}
              className="qr-code-image"
              style={{ width: '200px', height: '200px' }}
            />
            <p className="qr-code-caption">Scan this code to quickly access this bag</p>
          </>
        ) : (
          <>
            <QRCodeSVG
              id={`qr-code-${bag.id}`}
              value={qrData}
              size={200}
              level="H" // High error correction
              includeMargin={true}
            />
            <p className="qr-code-caption">
              QR code not yet uploaded. It will be generated automatically.
            </p>
          </>
        )}
      </div>
      
      <button 
        className="download-button"
        onClick={handleDownload}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Download QR Code
      </button>
      
      <div className="qr-code-info" style={{
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '4px',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)'
      }}>
        <p>
          <strong>Print size:</strong> 3cm × 3cm recommended<br />
          <strong>Format:</strong> SVG (scalable) or PNG from storage
        </p>
      </div>
    </div>
  );
}
