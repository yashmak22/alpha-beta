-- Enable vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Function to check if vector extension is enabled
CREATE OR REPLACE FUNCTION check_vector_extension()
RETURNS boolean AS $$
BEGIN
  RETURN true;
EXCEPTION
  WHEN undefined_function THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Function to match memories based on vector similarity
CREATE OR REPLACE FUNCTION match_memories(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  agent_filter uuid
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    memory_records.id,
    memory_records.content,
    memory_records.metadata,
    1 - (memory_records.embedding <=> query_embedding) as similarity
  FROM memory_records
  WHERE 
    memory_records.agent_id = agent_filter
    AND 1 - (memory_records.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
