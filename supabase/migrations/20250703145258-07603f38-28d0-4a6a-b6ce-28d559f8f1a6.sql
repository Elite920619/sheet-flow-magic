-- Create table for storing live events data
CREATE TABLE public.cached_live_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_data JSONB NOT NULL,
  region TEXT NOT NULL,
  sport TEXT NOT NULL,
  event_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, region)
);

-- Enable Row Level Security
ALTER TABLE public.cached_live_events ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to cached live events
CREATE POLICY "Anyone can view cached live events" 
ON public.cached_live_events 
FOR SELECT 
USING (true);

-- Create policy for service to manage cached live events
CREATE POLICY "Service can manage cached live events" 
ON public.cached_live_events 
FOR ALL 
USING (true);

-- Create index for faster queries
CREATE INDEX idx_cached_live_events_region ON public.cached_live_events(region);
CREATE INDEX idx_cached_live_events_sport ON public.cached_live_events(sport);
CREATE INDEX idx_cached_live_events_updated_at ON public.cached_live_events(updated_at);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_cached_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cached_live_events_updated_at
BEFORE UPDATE ON public.cached_live_events
FOR EACH ROW
EXECUTE FUNCTION public.update_cached_events_updated_at();

-- Create table for tracking background sync status
CREATE TABLE public.live_events_sync_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL, -- 'initial', 'periodic'
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'completed', 'error'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  events_synced INTEGER DEFAULT 0,
  regions_completed TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

-- Enable Row Level Security
ALTER TABLE public.live_events_sync_status ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to sync status
CREATE POLICY "Anyone can view sync status" 
ON public.live_events_sync_status 
FOR SELECT 
USING (true);

-- Create policy for service to manage sync status
CREATE POLICY "Service can manage sync status" 
ON public.live_events_sync_status 
FOR ALL 
USING (true);