-- JambonRider Database Schema
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create bags table
CREATE TABLE IF NOT EXISTS bags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  photo_url TEXT,
  loaded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bag_id UUID NOT NULL REFERENCES bags(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  photo_url TEXT,
  quantity INTEGER DEFAULT 1,
  description TEXT,
  tags TEXT[], -- Array of strings for tags
  checked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_bag_id ON items(bag_id);
CREATE INDEX IF NOT EXISTS idx_bags_created_at ON bags(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE bags ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policies for bags table
-- Since we have shared password auth, everyone can read/write all bags
CREATE POLICY "Anyone can view bags"
  ON bags FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert bags"
  ON bags FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update bags"
  ON bags FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete bags"
  ON bags FOR DELETE
  USING (true);

-- Create policies for items table
CREATE POLICY "Anyone can view items"
  ON items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert items"
  ON items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update items"
  ON items FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete items"
  ON items FOR DELETE
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_bags_updated_at 
  BEFORE UPDATE ON bags 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at 
  BEFORE UPDATE ON items 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE bags;
ALTER PUBLICATION supabase_realtime ADD TABLE items;
