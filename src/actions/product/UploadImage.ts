// app/actions/uploadImages.ts
"use server";

import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

async function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function checkCloudinaryConnection() {
  try {
    const res = await cloudinary.api.ping();
    console.log("Cloudinary conectado:", res);
  } catch (error) {
    console.error("❌ No se pudo conectar con Cloudinary:", error);
  }
}
export async function uploadImagesToCloudinary(formData: FormData) {
  await checkCloudinaryConnection();
  const files = formData.getAll("images") as File[];

  if (!files || files.length === 0) {
    console.log("❌No se encontraron imágenes en el formulario");
    return;
  }
  const uploads = await Promise.all(
    files.map(async (file) => {
      console.log("Subiendo archivo:", file.name, file.size);
      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = await bufferToStream(buffer);

      return new Promise<{ url: string; publicId: string }>(
        (resolve, reject) => {
          const upload = cloudinary.uploader.upload_stream(
            { folder: "productos" },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve({ url: result.secure_url, publicId: result.public_id });
            }
          );

          stream.pipe(upload);
        }
      );
    })
  );

  return uploads;
}
