-- Create similarity search function for Agent Memory
create or replace function match_agent_memory (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  filter_type text
)
returns table (
  id uuid,
  content text,
  similarity float,
  metadata jsonb
)
language plpgsql
as $$
begin
  return query
  select
    agent_memory.id,
    agent_memory.content,
    1 - (agent_memory.embedding <=> query_embedding) as similarity,
    agent_memory.metadata
  from agent_memory
  where 1 - (agent_memory.embedding <=> query_embedding) > match_threshold
  and agent_memory.type = filter_type
  order by agent_memory.embedding <=> query_embedding
  limit match_count;
end;
$$;
