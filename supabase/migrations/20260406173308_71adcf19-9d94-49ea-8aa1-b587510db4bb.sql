
CREATE TABLE public.public_voices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  citizen TEXT,
  gender TEXT,
  voicelink TEXT,
  voiceid TEXT,
  language TEXT,
  lang_code TEXT,
  description TEXT,
  voice_assign TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.public_voices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public voices are viewable by everyone"
ON public.public_voices
FOR SELECT
TO public
USING (true);
