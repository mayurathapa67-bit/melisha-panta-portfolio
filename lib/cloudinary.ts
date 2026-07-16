import { v2 } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

if (isCloudinaryConfigured()) {
  v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export async function uploadImage(
  dataUrl: string
): Promise<{ ok: boolean; url?: string; error?: string }> {
  if (!isCloudinaryConfigured()) {
    return { ok: false, error: "Cloudinary is not configured." };
  }
  try {
    const result = await v2.uploader.upload(dataUrl, {
      folder: "melisha-portfolio",
      resource_type: "auto",
    });
    return { ok: true, url: result.secure_url };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Upload failed.",
    };
  }
}
