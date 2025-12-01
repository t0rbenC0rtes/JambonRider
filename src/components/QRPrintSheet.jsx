import { QRCodeSVG } from 'qrcode.react';
import { useStore } from '../store/useStore';
import { generateQRData } from '../lib/qrHelpers';
import '../styles/QRPrintSheet.css';

/**
 * QR Print Sheet Component
 * Generates printable sheet with 3x3cm QR code labels for all bags
 */
export default function QRPrintSheet() {
  const bags = useStore((state) => state.bags);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qr-print-container">
      <div className="qr-print-header no-print">
        <h1>Print QR Code Labels</h1>
        <p>Each label is 3cm × 3cm. Use sticky label paper or cut and tape.</p>
        <button onClick={handlePrint} className="print-button">
          Print Labels
        </button>
      </div>

      {/* Grid Layout - Multiple labels per page */}
      <div className="qr-label-grid">
        {bags.map((bag) => {
          const qrData = generateQRData(bag.id);
          return (
            <div key={bag.id} className="qr-label">
              <QRCodeSVG
                value={qrData}
                size={96} // ~3cm at 96 DPI
                level="H"
                includeMargin={false}
              />
              <div className="qr-label-name">{bag.name}</div>
            </div>
          );
        })}
      </div>

      {/* Page Break */}
      <div className="page-break"></div>

      {/* Individual Cards - One per page */}
      <div className="qr-cards">
        {bags.map((bag) => {
          const qrData = generateQRData(bag.id);
          return (
            <div key={`card-${bag.id}`} className="qr-card">
              <div className="qr-card-content">
                <h2>{bag.name}</h2>
                <div className="qr-card-code">
                  <QRCodeSVG
                    value={qrData}
                    size={256} // Larger for individual cards
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="qr-card-instructions">
                  <p>Scan with JambonRider app</p>
                  <p className="qr-card-id">ID: {bag.id.slice(0, 8)}</p>
                </div>
              </div>
              <div className="page-break"></div>
            </div>
          );
        })}
      </div>

      <div className="qr-print-footer no-print">
        <p>
          Tip: Print the label grid on sticky label paper for easy application.
          Individual cards can be laminated for durability.
        </p>
      </div>
    </div>
  );
}
