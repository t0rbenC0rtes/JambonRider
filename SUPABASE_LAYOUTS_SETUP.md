# Supabase Layouts Table Setup

## SQL Script

Run this SQL in the Supabase SQL Editor to create the layouts table:

```sql
-- Create layouts table
CREATE TABLE IF NOT EXISTS layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bag_ids TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE layouts ENABLE ROW LEVEL SECURITY;

-- Public can read layouts
CREATE POLICY "Public can read layouts"
ON layouts FOR SELECT
USING (true);

-- Anyone can insert layouts
CREATE POLICY "Public can insert layouts"
ON layouts FOR INSERT
WITH CHECK (true);

-- Anyone can update layouts
CREATE POLICY "Public can update layouts"
ON layouts FOR UPDATE
USING (true);

-- Anyone can delete layouts
CREATE POLICY "Public can delete layouts"
ON layouts FOR DELETE
USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE layouts;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_layouts_updated_at
BEFORE UPDATE ON layouts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one active layout at a time
CREATE OR REPLACE FUNCTION ensure_single_active_layout()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE layouts SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_active_layout_trigger
AFTER INSERT OR UPDATE OF is_active ON layouts
FOR EACH ROW
EXECUTE FUNCTION ensure_single_active_layout();
```

## How It Works

1. **layouts table** stores layout configurations
2. **is_active** ensures only one layout can be active at a time (controlled by trigger)
3. **bag_ids** is an array of bag IDs included in the layout
4. **RLS policies** allow public access (change to authenticated if needed)
5. **Realtime enabled** for live updates across devices
6. **Auto-updated timestamps** via trigger

## Testing

After running the SQL:
1. Go to Admin → Gérer les layouts
2. Create a new layout
3. Select bags and save
4. Activate the layout
5. Check Load mode - only selected bags appear!
