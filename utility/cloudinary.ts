import { toast } from "sonner";

type SetUploadingFn = React.Dispatch<React.SetStateAction<boolean>>;
interface CloudinaryUploadResult {
  url: string | null;
  error: string | null;
}

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Accept mediaType: 'image' | 'video'
export async function uploadImageToCloudinary(
  file: File,
  setUploading: SetUploadingFn,
  mediaType: 'image' | 'video' = 'image'
): Promise<CloudinaryUploadResult | null> {
  if (!file) return null;
  setUploading(true);
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${mediaType}/upload`;
  const formDataUpload = new FormData();
  formDataUpload.append("file", file);
  formDataUpload.append("upload_preset", CLOUDINARY_UPLOAD_PRESET || "");
  try {
    const res = await fetch(uploadUrl, {
      method: "POST",
      body: formDataUpload,
    });
    const data: { secure_url?: string } = await res.json();
    if (data.secure_url) {
      return { url: data.secure_url, error: null };
    } else {
      return { url: null, error: "Cloudinary upload failed" };
    }
  } catch (err) {
    console.log(err);
    return { url: null, error: "Cloudinary upload error" };
  } finally {
    setUploading(false);
  }
}

export async function deleteImageFromCloudinary(imageUrl: string, courseId?: string, mediaType: 'image' | 'video' = 'image'): Promise<boolean> {
  try {
    // Call your backend API to delete the image from Cloudinary
    // You must implement this API route (e.g., /api/delete-image)
    const res = await fetch('/api/cloudinary/delete-course-thumbnail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, courseId, mediaType }),
    });
    if (!res.ok) throw new Error('Failed to delete image');
    return true;
  } catch (err) {
    console.error(err);
    toast.error('Failed to delete image from Cloudinary');
    return false;
  }
}
