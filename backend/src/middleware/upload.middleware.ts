/**
 * File Upload Middleware
 * Multer-based file upload handling with validation.
 * Supports memory storage for Supabase uploads.
 */

import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import config from '../config/environment';
import { InvalidFileTypeError } from '../utils/errors';

// =====================================================
// STORAGE: Memory (files processed then uploaded to Supabase)
// =====================================================
const memoryStorage = multer.memoryStorage();

// =====================================================
// FILE FILTER
// =====================================================
function createFileFilter(allowedTypes: string[]) {
  return (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new InvalidFileTypeError(allowedTypes));
    }
  };
}

// =====================================================
// IMAGE UPLOAD (portfolios, blogs, avatars)
// =====================================================
export const uploadImage = multer({
  storage: memoryStorage,
  limits: {
    fileSize: config.upload.maxFileSizeBytes,
    files: 1,
  },
  fileFilter: createFileFilter([...config.upload.allowedImageTypes]),
});

/** Single image upload with field name "image" */
export const singleImage = uploadImage.single('image');

/** Multiple images upload (max 5) */
export const multipleImages = uploadImage.array('images', 5);

// =====================================================
// AVATAR UPLOAD (smaller size limit: 2MB)
// =====================================================
export const uploadAvatar = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1,
  },
  fileFilter: createFileFilter(['image/jpeg', 'image/png', 'image/webp']),
}).single('avatar');
