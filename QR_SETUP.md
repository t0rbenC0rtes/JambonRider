# QR Code System - Setup Instructions

## Overview
The QR code system allows helpers to quickly identify and access bag details by scanning QR codes printed on bag labels. QR codes are automatically generated when bags are created and stored in Supabase Storage.

## Implementation Status

### ✅ Completed
1. **Libraries Installed**
   - `html5-qrcode` - For camera-based QR scanning
   - `qrcode.react` - For QR code generation and display

2. **Helper Functions Created**
   - `src/lib/qrHelpers.js` - QR generation, parsing, and validation
   - `src/lib/supabaseHelpers.js` - Updated with QR upload/delete functions

3. **Store Updated**
   - Auto-generates QR codes when bags are created
   - Cleans up QR codes when bags are deleted

4. **Components Created**
   - `QRScanner.jsx` - Camera-based scanner component
   - `QRScannerPage.jsx` - Full-screen scan interface at `/load/scan`
   - `QRCodeDisplay.jsx` - Shows QR in admin bag detail with download
   - `QRPrintSheet.jsx` - Batch print labels and cards at `/admin/qr-print`

5. **UI Integration**
   - Floating "Scanner QR" button in Load mode
   - QR code display in admin bag detail page
   - "Imprimer QR codes" button in admin bags page
   - Routes configured for `/load/scan` and `/admin/qr-print`

### ⚠️ Database Migration Required

**IMPORTANT:** You must run the database migration to add the `qr_code_url` column to the `bags` table.

#### Steps to Run Migration:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `dswekqscpstabtwcnmwa`

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New query"

3. **Run Migration SQL**
   - Copy the contents of `migrations/add_qr_code_column.sql`
   - Paste into the SQL editor
   - Click "Run" or press Ctrl+Enter

4. **Verify Migration**
   - Go to "Table Editor" → "bags" table
   - Check that `qr_code_url` column now exists (type: TEXT)

#### Migration SQL:
```sql
-- Add QR code URL column to bags table
ALTER TABLE bags 
ADD COLUMN IF NOT EXISTS qr_code_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN bags.qr_code_url IS 'Public URL to the QR code image stored in Supabase Storage (item-photos bucket)';
```

### 🔄 Automatic QR Generation

Once the migration is complete, QR codes will automatically:
- Generate when creating new bags
- Upload to Supabase Storage (`item-photos` bucket as `qr-{bagId}.png`)
- Store the public URL in the database
- Display in admin bag detail page
- Delete when bags are deleted

### 📱 QR Code Usage Workflow

#### For Admin:
1. Create a bag (QR code auto-generates)
2. Navigate to `/admin/qr-print` or click "Imprimer QR codes"
3. Print the label sheet (3x3cm labels) or individual cards
4. Apply labels to physical bags

#### For Helpers (Load Mode):
1. Open the app in Load mode (`/load`)
2. Click the floating "Scanner QR" button (bottom right)
3. Allow camera permissions when prompted
4. Point camera at QR code on bag
5. Automatically redirected to bag detail with checklist

### 📄 Printing QR Codes

**Label Sheet:**
- Grid layout with multiple 3cm × 3cm labels per page
- Ideal for sticky label paper
- Each label includes bag name and QR code

**Individual Cards:**
- One card per page (large format)
- Includes bag name, QR code, and instructions
- Can be laminated for durability

**Recommended Print Settings:**
- Paper size: A4 or Letter
- Quality: High (for crisp QR codes)
- Color: Black & white is sufficient
- Scale: 100% (do not scale to fit)

### 🔍 QR Code Format

QR codes contain JSON data:
```json
{
  "app": "jambonrider",
  "bagId": "uuid-of-bag",
  "timestamp": "ISO-8601-date"
}
```

- `app` field validates this is a JambonRider QR code
- `bagId` never changes even if bag name is updated
- `timestamp` records when QR was generated

### 🐛 Troubleshooting

**Camera not working:**
- Ensure browser has camera permissions
- Try using HTTPS (required for camera access on some browsers)
- Check if camera is being used by another application

**QR code not scanning:**
- Ensure QR code is printed clearly (not blurry)
- Try adjusting distance from camera
- Ensure adequate lighting
- Minimum recommended size: 3cm × 3cm

**QR code not generating:**
- Check browser console for errors
- Verify Supabase Storage bucket `item-photos` exists
- Check storage permissions in Supabase dashboard

**Old bags missing QR codes:**
- QR codes only auto-generate for new bags
- Edit an old bag to trigger QR generation
- Or use the QR display component's download button

### 📦 Storage Information

QR codes are stored in:
- **Bucket:** `item-photos` (same as item photos)
- **Path pattern:** `qr-{bagId}.png`
- **File type:** PNG image (96 DPI, ~3KB each)
- **Public access:** Yes (required for display)

### 🔐 Security Notes

- QR codes are public (no sensitive data)
- Scanning only works within the app (validates format)
- Invalid QR codes are rejected with user-friendly message
- Load mode is public but admin functions require authentication

## Next Steps

1. ✅ Run database migration (see above)
2. ✅ Test QR generation by creating a new bag
3. ✅ Print test labels using `/admin/qr-print`
4. ✅ Test scanning with `/load/scan` on mobile device
5. ✅ Deploy to production (Vercel will auto-deploy)

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify database migration was successful
3. Check Supabase Storage permissions
4. Ensure all dependencies are installed (`npm install`)
