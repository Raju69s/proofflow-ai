/**
 * Supabase Storage Integration Service for ProofFlow AI.
 * Handles secure user-scoped folder uploading, MIME validation, and size capping.
 */

// File size limits (in bytes)
export const FILE_LIMITS = {
  FREE_KB: 1 * 1024 * 1024, // 1MB
  PRO_KB: 10 * 1024 * 1024, // 10MB
  PHOTO_MAX: 10 * 1024 * 1024 // 10MB (for both Free and Pro photo uploads)
};

// Supported MIME types
export const ALLOWED_DOC_TYPES = [
  'application/pdf', 
  'text/plain', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'text/html', 
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // XLSX
];

export const ALLOWED_PHOTO_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

/**
 * Uploads a job photo to the 'job-photos' storage bucket.
 * Organizes path under: job-photos/{userId}/{timestamp}_{fileName}
 */
export async function uploadJobPhoto(supabase, file, userId, onProgress) {
  if (!file) throw new Error("No file selected.");
  if (!userId) throw new Error("Authentication required.");

  // Check photo MIME type
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    throw new Error(`Invalid photo type. Supported: JPG, PNG, WEBP.`);
  }

  // Check photo size
  if (file.size > FILE_LIMITS.PHOTO_MAX) {
    throw new Error(`Photo size exceeds the 10MB limit.`);
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${userId}/${Date.now()}_${cleanFileName}`;

  // Supabase Storage upload
  const { data, error } = await supabase.storage
    .from('job-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;

  // Retrieve public URL
  const { data: urlData } = supabase.storage
    .from('job-photos')
    .getPublicUrl(filePath);

  return {
    success: true,
    fileName: file.name,
    filePath: filePath,
    url: urlData.publicUrl,
    sizeBytes: file.size
  };
}

/**
 * Uploads a knowledge base document to the 'knowledge-base' storage bucket.
 * Organizes path under: knowledge-base/{userId}/{fileName}
 */
export async function uploadKBDocument(supabase, file, userId, currentStorageUsed = 0, planType = 'free') {
  if (!file) throw new Error("No file selected.");
  if (!userId) throw new Error("Authentication required.");

  // Check document MIME type
  const isSupported = ALLOWED_DOC_TYPES.includes(file.type) || 
                      file.name.endsWith('.docx') || 
                      file.name.endsWith('.xlsx');
                      
  if (!isSupported) {
    throw new Error(`Unsupported document type. Supported: PDF, TXT, DOCX, HTML, XLSX.`);
  }

  // Enforce storage limits based on user plan
  const storageLimit = planType === 'pro' ? FILE_LIMITS.PRO_KB : FILE_LIMITS.FREE_KB;
  if (currentStorageUsed + file.size > storageLimit) {
    const limitLabel = planType === 'pro' ? '10MB' : '1MB';
    throw new Error(`Storage limit reached! Your active plan restricts cumulative storage to ${limitLabel}. Please upgrade to clear limits.`);
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${userId}/${cleanFileName}`;

  // Supabase Storage upload
  const { data, error } = await supabase.storage
    .from('knowledge-base')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;

  return {
    success: true,
    fileName: file.name,
    filePath: filePath,
    sizeBytes: file.size,
    fileType: file.type || 'application/octet-stream'
  };
}

/**
 * Deletes a file from any storage bucket.
 */
export async function deleteStorageFile(supabase, bucketName, filePath) {
  if (!filePath) return { success: false };

  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);

  if (error) throw error;
  return { success: true, data };
}
