import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfvzocorz';
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'acb-computers';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

export const cloudinaryService = {
  /**
   * Upload ảnh lên Cloudinary
   * @param file - File ảnh cần upload
   * @param folder - Folder trên Cloudinary (optional)
   * @returns Promise với URL ảnh đã upload
   */
  uploadImage: async (file: File, folder = 'products'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);

    try {
      const response = await axios.post<CloudinaryUploadResponse>(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      throw new Error(error?.response?.data?.error?.message || 'Failed to upload image');
    }
  },

  /**
   * Upload nhiều ảnh
   * @param files - Mảng các file ảnh
   * @param folder - Folder trên Cloudinary
   * @returns Promise với mảng URLs
   */
  uploadMultipleImages: async (files: File[], folder = 'products'): Promise<string[]> => {
    const uploadPromises = files.map((file) => cloudinaryService.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  },

  deleteImage: async (publicId: string): Promise<void> => {
    // This requires a signed request from backend
    console.log('Delete image:', publicId);
    // Implement backend endpoint if needed
  },
};
