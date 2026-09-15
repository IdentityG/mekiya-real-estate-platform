-- Add virtual tour and enhanced media fields to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS virtual_tour_360_url TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS video_tour_url TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS video_tour_thumbnail TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS street_view_enabled BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS construction_status VARCHAR(50);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS construction_timeline JSONB DEFAULT '[]'::jsonb;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS completion_date TIMESTAMP;

-- Add comments for documentation
COMMENT ON COLUMN properties.virtual_tour_360_url IS '360° virtual tour URL (Pannellum, Matterport, etc.)';
COMMENT ON COLUMN properties.video_tour_url IS 'Video tour URL (YouTube, Vimeo, or direct video)';
COMMENT ON COLUMN properties.video_tour_thumbnail IS 'Thumbnail image for video tour';
COMMENT ON COLUMN properties.street_view_enabled IS 'Enable Google Street View integration';
COMMENT ON COLUMN properties.construction_status IS 'Construction status: completed, under_construction, or planned';
COMMENT ON COLUMN properties.construction_timeline IS 'Timeline array with phases, dates, descriptions, images, and progress';
COMMENT ON COLUMN properties.completion_date IS 'Expected completion date for under-construction properties';

-- Create index for construction status queries
CREATE INDEX IF NOT EXISTS properties_construction_status_idx ON properties(construction_status) WHERE construction_status IS NOT NULL;
