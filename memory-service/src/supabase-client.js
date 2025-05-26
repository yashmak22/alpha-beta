// Supabase client for memory service
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for backend services

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_KEY env variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize vector store
const initializeVectorStore = async () => {
  try {
    // Check if memory_records table exists with vector extension
    const { error } = await supabase.rpc('check_vector_extension');
    
    if (error) {
      console.error('Supabase pgvector extension not enabled:', error);
      console.log('Please enable the vector extension in your Supabase project SQL editor:');
      console.log("CREATE EXTENSION IF NOT EXISTS vector;");
    } else {
      console.log('Supabase vector extension is enabled');
    }
  } catch (error) {
    console.error('Error checking vector extension:', error);
  }
};

// Store embedding in Supabase
const storeEmbedding = async (content, metadata, embedding, agentId) => {
  try {
    const { data, error } = await supabase
      .from('memory_records')
      .insert({
        content,
        metadata,
        embedding,
        agent_id: agentId
      })
      .select('id');
      
    if (error) throw error;
    
    return data[0]?.id;
  } catch (error) {
    console.error('Error storing embedding:', error);
    throw error;
  }
};

// Query embeddings using vector similarity
const queryEmbeddings = async (embedding, agentId, limit = 5) => {
  try {
    // Use Supabase's vector similarity search
    const { data, error } = await supabase
      .rpc('match_memories', { 
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: limit,
        agent_filter: agentId
      });
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error querying embeddings:', error);
    throw error;
  }
};

module.exports = {
  supabase,
  initializeVectorStore,
  storeEmbedding,
  queryEmbeddings
};
