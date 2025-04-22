"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getCategories,
  getBrands,
  setCategorie,
  setBrand,
  createProduct,
  uploadImagesToCloudinary,
} from "@/actions";
import { BrandsItem, CategoriesItem } from "@/interfaces";
import { ImageInput, Modal, Select, TextField } from "@/components";
import Textarea from "@/components/ui/Textarea";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";

const AddProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    images: [] as unknown as { url: string; id: number }[],
  });
  const [categories, setCategories] = useState<CategoriesItem[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [brands, setBrands] = useState<BrandsItem[]>([]);
  const [images, setImages] = useState<File[]>([]);
  useEffect(() => {
    (async () => {
      const categoriesItems = await getCategories();
      const brandsItems = await getBrands();
      setCategories(categoriesItems);
      setBrands(brandsItems);
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!product.name) newErrors.name = "El nombre es obligatorio.";
    if (!product.price || parseFloat(product.price) <= 0)
      newErrors.price = "El precio debe ser mayor a 0.";
    if (!product.category) newErrors.category = "La categoría es obligatoria.";
    if (!product.brand) newErrors.brand = "La marca es obligatoria.";
    if (!product.images) newErrors.image = "La imagen es obligatoria.";
    return newErrors;
  };
  const handleDeleteImage = (fileName: string) => {
    if (!product) return;
    const imagenesFiltradas = images.filter((img) => img.name !== fileName);
    setImages(imagenesFiltradas);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    // Agregamos los archivos nuevos al FormData
    images.forEach((file) => {
      formData.append("images", file);
    });
    const savedImages = await uploadImagesToCloudinary(formData);

    // Agregamos el resto de la data como JSON (producto sin imagenes)
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Revisa los errores del formulario.");
      return;
    }
    if (!savedImages) {
      toast.error("Revisa los errores del formulario.");
      return;
    }
    await createProduct({ ...product, images: savedImages });
    toast.success("Producto agregado correctamente.");
    // Aquí iría la lógica real para guardar el producto
  };
  //   const categories = ["Pañales", "Higiene", "Accesorios"];
  //   const brands = ["Huggies", "Pampers", "Johnson's"];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Agregar nuevo producto
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <TextField
            label="Nombre"
            name="name"
            value={product.name}
            onChange={handleChange}
            errors={errors}
            helperText="Nombre identificatorio del producto."
            placeholder="Ej: Pañal Huggies"
          />

          {/* Descripción */}
          <Textarea
            label="Descripción"
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Breve descripción del producto"
            helperText="Detalle del producto, presentación, unidades, etc."
          />

          {/* Precio */}
          <TextField
            type="number"
            name="price"
            label="Precio ($)"
            helperText="Precio del producto en pesos."
            value={product.price}
            onChange={handleChange}
            placeholder="Ej: 1999.99"
            errors={errors}
          />

          {/* Categoría */}
          <Select
            label="Categoría"
            name="category"
            value={product.category}
            onChange={handleChange}
            helperText="Selecciona una categoría del producto."
            errors={errors}
            options={categories.map(({ id, nombre }) => ({
              id: id.toString(),
              nombre,
            }))}
            buttonAction={
              <Modal
                callback={async (value) => {
                  const newCategory = await setCategorie(value);
                  setCategories([...categories, newCategory]);
                  toast.success("Categoría creada correctamente.");
                }}
                buttonLabel="Crear nueva categoría"
                title="Crear nueva categoría"
              />
            }
          />

          {/* Marca */}
          <Select
            label="Marca"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            helperText="Selecciona una marca del producto."
            errors={errors}
            options={brands.map(({ id, nombre }) => ({
              id: id.toString(),
              nombre,
            }))}
            buttonAction={
              <Modal
                callback={async (value) => {
                  const newBrands = await setBrand(value);
                  setBrands([...brands, newBrands]);
                  toast.success("Marca creada correctamente.");
                }}
                buttonLabel="Crear nueva marca"
                title="Crear nueva marca"
              />
            }
          />

          {/* Imagen */}
          <ImageInput
            multiple
            label="Agrega una imagen"
            onChange={(e) => {
              if (!e.target.files?.length) return;
              setImages([...images, ...Array.from(e.target.files)]);
              e.target.value = "";
            }}
          />

          {/* Carrusel de Imágenes */}
          <div>
            <span className="block text-sm font-medium mb-2">
              Imágenes del producto
            </span>
            <div className="flex overflow-x-auto gap-4">
              {images.map((file, index) => (
                <div
                  key={`${index}-${file.name}`}
                  className="relative w-40 h-40 border rounded-lg overflow-hidden"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    width={160}
                    height={160}
                    alt="Imagen producto"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(file.name)}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                    title="Eliminar imagen"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Guardar producto
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
