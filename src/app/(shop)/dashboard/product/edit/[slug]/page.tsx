"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiSave, FiTrash2 } from "react-icons/fi";
import {
  getProductDetail,
  getCategories,
  getBrands,
  updateProduct,
  uploadImagesToCloudinary,
  deleteProductImage,
} from "@/actions";
import { ImageInput, Select, TextField } from "@/components";
import Textarea from "@/components/ui/Textarea";
import Image from "next/image";
import toast from "react-hot-toast";

type Producto = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number;
  marcaId: number;
  promocionId?: number | null;
  imagenes: { id: number; url: string; publicId: string }[];
};

type Opcion = { id: number; nombre: string };

export default function EditProductPage() {
  const { slug } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [marcas, setMarcas] = useState<Opcion[]>([]);
  const [categorias, setCategorias] = useState<Opcion[]>([]);
  const [imagenesNuevas, setImagenesNuevas] = useState<File[]>([]);

  useEffect(() => {
    (async () => {
      const [productDetailDB, marcasDB, categoriasDB] = await Promise.all([
        getProductDetail(slug as string),
        getBrands(),
        getCategories(),
      ]);
      setProducto(productDetailDB);
      setMarcas(marcasDB);
      setCategorias(categoriasDB);
      setLoading(false);
    })();
  }, [slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!producto) return;
    const { name, value } = e.target;
    setProducto({
      ...producto,
      [name]: name === "precio" || name === "stock" ? Number(value) : value,
    });
  };

  const handleSelectChange = (name: keyof Producto, value: number) => {
    if (!producto) return;
    setProducto({ ...producto, [name]: value });
  };

  const handleDeleteImage = async (id: number) => {
    if (!producto) return;
    const confirmDelete = confirm("¿Seguro que deseas eliminar esta imagen?");
    if (!confirmDelete) return;
    await deleteProductImage(id);
    const imagenesFiltradas = producto.imagenes.filter((img) => img.id !== id);
    setProducto({ ...producto, imagenes: imagenesFiltradas });
  };

  const handleSave = async () => {
    try {
      if (!producto) return;
      if (!producto.imagenes.length && !imagenesNuevas.length) {
        toast.error("EL producto debe tener al menos 1 imagen");
      }
      const formData = new FormData();
      // Agregamos los archivos nuevos al FormData
      if (imagenesNuevas.length) {
        imagenesNuevas.forEach((file) => {
          formData.append("images", file);
        });
      }
      const savedImages = imagenesNuevas.length
        ? await uploadImagesToCloudinary(formData)
        : null;
      // Agregamos el resto de la data como JSON (producto sin imagenes)
      formData.append(
        "producto",
        JSON.stringify({
          ...producto,
          imagenes: savedImages
            ? [...producto.imagenes, ...savedImages]
            : [...producto.imagenes],
        })
      );
      const createdProduct = await updateProduct(producto?.slug, {
        ...JSON.parse(formData.get("producto") as string),
      });
      setProducto(createdProduct);
      // Si se subieron imágenes nuevas, las agregamos al producto
      if (createdProduct) {
        toast.success("Producto actualizado con exito");
        setImagenesNuevas([]);
      } else {
        toast.error("Error al guardar actualización de producto");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar actualización de producto");
    }
  };

  if (loading) return <div className="p-6">Cargando producto...</div>;
  if (!producto)
    return <div className="p-6 text-red-600">Producto no encontrado</div>;

  return (
    <div className="max-w-2xl !mx-auto !p-4">
      <h1 className="!text-3xl !font-extrabold !flex !items-center !gap-2 !mb-6 !text-[#324d67]">
        <FiSave /> Editar Producto
      </h1>

      <div className="!bg-white !rounded-2xl !shadow-sm !border !border-gray-100 !w-full !px-4 !py-6 sm:!px-8 sm:!py-8 !space-y-5">
        <TextField
          label="Nombre"
          name="nombre"
          value={producto.nombre}
          onChange={handleChange}
          className="!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !text-base !text-gray-800 !placeholder-gray-400 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
        />

        <Textarea
          label="Descripción"
          name="descripcion"
          value={producto.descripcion}
          onChange={handleChange}
          className="!mt-1 !block !w-full !border !border-gray-200 !rounded-2xl !shadow-sm !p-3 !text-base !text-gray-800 !placeholder-gray-400 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white !resize-none"
        />

        <TextField
          label="Precio"
          type="number"
          name="precio"
          value={producto.precio.toString()}
          onChange={handleChange}
          className="!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !text-base !text-gray-800 !placeholder-gray-400 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
        />

        <TextField
          label="Stock"
          type="number"
          name="stock"
          value={producto.stock.toString()}
          onChange={handleChange}
          className="!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !text-base !text-gray-800 !placeholder-gray-400 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
        />

        <Select
          label="Categoría"
          name="categoria"
          value={producto.categoriaId.toString()}
          onChange={(val) =>
            handleSelectChange("categoriaId", Number(val.target.value))
          }
          options={categorias.map((cat) => ({
            nombre: cat.nombre,
            id: cat.id.toString(),
          }))}
        />

        <Select
          label="Marca"
          name="marca"
          value={producto.marcaId.toString()}
          onChange={(val) =>
            handleSelectChange("marcaId", Number(val.target.value))
          }
          options={marcas.map((m) => ({
            nombre: m.nombre,
            id: m.id.toString(),
          }))}
        />

        {producto.promocionId && (
          <TextField
            label="Código de Promoción"
            name="promocionId"
            value={producto.promocionId.toString() || ""}
            onChange={(e) =>
              setProducto({
                ...producto,
                promocionId: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !text-base !text-gray-800 !placeholder-gray-400 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
          />
        )}

        {/* Carrusel de Imágenes */}
        <div>
          <h2 className="!text-base !font-semibold !mb-2 !text-[#324d67]">
            Imágenes del producto
          </h2>
          <div className="flex overflow-x-auto gap-4">
            {producto.imagenes.map((img) => (
              <div
                key={img.id}
                className="relative w-40 h-40 border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
              >
                <Image
                  src={img.url}
                  width={160}
                  height={160}
                  alt="Imagen producto"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="cursor-pointer absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow"
                  title="Eliminar imagen"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Agregar nuevas imágenes */}
        <ImageInput
          multiple
          label="Agregar nuevas imágenes"
          onChange={(e) => {
            if (!e.target.files?.length) return;
            setImagenesNuevas([
              ...imagenesNuevas,
              ...Array.from(e.target.files),
            ]);
            e.target.value = "";
          }}
        />
        {imagenesNuevas.length > 0 && (
          <div className="mt-4">
            <h2 className="!text-base !font-semibold !mb-2 !text-[#324d67]">
              Nuevas imágenes (aún no subidas)
            </h2>
            <div className="flex overflow-x-auto gap-4">
              {imagenesNuevas.map((file, i) => (
                <div
                  key={i}
                  className="relative w-40 h-40 border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    width={160}
                    height={160}
                    alt="Nueva imagen"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          className="!w-full cursor-pointer !bg-[#f02d34] !text-white !p-3 !rounded-full !font-semibold !text-base !shadow-sm hover:!bg-[#d12a2f] !transition disabled:!opacity-60 disabled:!cursor-not-allowed !mt-2"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
