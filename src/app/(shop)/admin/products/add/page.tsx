"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getCategories,
  getBrands,
  createProduct,
  setCategorie,
  setBrand,
} from "@/actions";
import { BrandsItem, CategoriesItem } from "@/interfaces";
import { Modal, Select, TextField } from "@/components";
import Textarea from "@/components/ui/Textarea";

const AddProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    image: "",
  });
  const [categories, setCategories] = useState<CategoriesItem[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [brands, setBrands] = useState<BrandsItem[]>([]);
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
    if (!product.image) newErrors.image = "La imagen es obligatoria.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Revisa los errores del formulario.");
      return;
    }
    await createProduct(product);
    toast.success("Producto agregado correctamente.");
    console.log("Producto:", product);
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
          <TextField
            label="URL Imagen"
            type="text"
            name="image"
            value={product.image}
            onChange={handleChange}
            errors={errors}
            placeholder="https://..."
          />

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
