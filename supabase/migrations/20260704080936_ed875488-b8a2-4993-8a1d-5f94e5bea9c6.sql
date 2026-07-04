
CREATE TABLE public.agent_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  agent_type TEXT NOT NULL,
  input_json JSONB NOT NULL,
  output_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_history TO authenticated;
GRANT ALL ON public.agent_history TO service_role;
ALTER TABLE public.agent_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own history" ON public.agent_history FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX agent_history_user_created_idx ON public.agent_history (user_id, created_at DESC);
