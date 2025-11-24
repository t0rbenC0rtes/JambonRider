# Supabase Storage Setup Instructions

## Create Storage Bucket

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/dswekqscpstabtwcnmwa

2. Navigate to **Storage** in the left sidebar

3. Click **"New bucket"**

4. Configure the bucket:
   - **Name**: `item-photos`
   - **Public bucket**: ✅ Enable (checked)
   - **File size limit**: 5 MB (optional, recommended)
   - **Allowed MIME types**: `image/*` (optional, recommended)

5. Click **"Create bucket"**

## Configure Bucket Policies (Public Access)

The bucket is already public, but you can verify/configure policies:

1. Click on the `item-photos` bucket
2. Go to **"Policies"** tab
3. You should see these policies or create them:

### Policy 1: Public Read Access
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'item-photos' );
```

### Policy 2: Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'item-photos' );
```

### Policy 3: Authenticated Delete
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'item-photos' );
```

## Or Use These SQL Commands

Run this in the SQL Editor (SQL Editor in left sidebar):

```sql
-- Public read access
CREATE POLICY "Public read access for item photos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'item-photos' );

-- Allow anyone to upload
CREATE POLICY "Allow public uploads to item photos"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'item-photos' );

-- Allow anyone to delete
CREATE POLICY "Allow public deletes from item photos"
ON storage.objects FOR DELETE
USING ( bucket_id = 'item-photos' );
```

## Verify Setup

After creating the bucket:
1. The upload feature should work in your app
2. Images will be compressed to max 1200x1200px at 80% quality
3. Photos are accessible via public URLs
4. Old photos are automatically deleted when items are updated/deleted

## Notes

- Photos are automatically compressed before upload
- Maximum dimensions: 1200x1200 pixels
- Format: JPEG at 80% quality
- Mobile camera support with `capture="environment"` attribute
- File input accepts all image types (`image/*`)
