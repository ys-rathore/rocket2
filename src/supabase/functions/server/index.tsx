import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize storage bucket on startup
const BUCKET_NAME = 'make-b378ac23-study-notes';

async function initializeBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      });
      if (error) console.error('Error creating bucket:', error);
      else console.log('Study notes bucket created successfully');
    }
  } catch (error) {
    console.error('Error initializing bucket:', error);
  }
}

initializeBucket();

// Health check
app.get('/make-server-b378ac23/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Upload note
app.post('/make-server-b378ac23/notes/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const uploadedBy = formData.get('uploadedBy') as string;
    const type = formData.get('type') as string;

    if (!title || !uploadedBy) {
      return c.json({ error: 'Title and uploader name are required' }, 400);
    }

    const noteId = crypto.randomUUID();
    let fileName = '';
    let fileType = '';

    // Upload file to storage if provided (PDF mode)
    if (file && type === 'pdf') {
      fileName = `${Date.now()}-${file.name}`;
      const fileBuffer = await file.arrayBuffer();
      
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileBuffer, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return c.json({ error: 'Failed to upload file' }, 500);
      }
      
      fileType = file.type;
    }

    // Store note metadata in KV
    const noteData = {
      id: noteId,
      title,
      description,
      content: content || '',
      category,
      fileName,
      fileType,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
      views: 0
    };

    await kv.set(`note:${noteId}`, noteData);
    
    // Add to notes index
    const notesIndex = await kv.get('notes:index') || [];
    notesIndex.push(noteId);
    await kv.set('notes:index', notesIndex);

    return c.json({ success: true, noteId, note: noteData });
  } catch (error) {
    console.error('Error uploading note:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});