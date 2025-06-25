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
  try {
    await checkCloudinaryConnection();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      throw new Error("No se encontraron imágenes en el formulario");
    }
    // Validación de archivos: tamaño y tipo
    const maxSizeMB = 5;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`El tipo de archivo ${file.type} no está permitido.`);
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(
          `El archivo ${file.name} supera el tamaño máximo de ${maxSizeMB}MB.`
        );
      }
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
  } catch (error) {
    console.error("Error al subir imágenes a Cloudinary:", error);
    throw error;
  }
}
