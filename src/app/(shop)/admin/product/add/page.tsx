"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiPlusCircle } from "react-icons/fi";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { getCategories, getBrands } from "@/actions";
import { BrandsItem, CategoriesItem } from "@/interfaces";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Revisa los errores del formulario.");
      return;
    }

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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Ej: Pañal Huggies"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nombre identificatorio del producto.
            </p>
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <AiOutlineExclamationCircle size={16} className="mr-1" />{" "}
                {errors.name}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Breve descripción del producto"
            />
            <p className="text-xs text-gray-500 mt-1">
              Detalle del producto, presentación, unidades, etc.
            </p>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Precio ($)
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Ej: 1999.99"
            />
            {errors.price && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <AiOutlineExclamationCircle size={16} className="mr-1" />{" "}
                {errors.price}
              </p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-gray-700">
                Categoría
              </label>
              <button
                type="button"
                onClick={() => toast("Abrir modal de nueva categoría")}
                className="flex items-center text-indigo-600 hover:underline text-sm"
              >
                <FiPlusCircle size={18} className="mr-1" /> Nueva
              </button>
            </div>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.category ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(({ nombre, id }, index) => (
                <option key={`${nombre}-${index}`} value={id}>
                  {nombre}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <AiOutlineExclamationCircle size={16} className="mr-1" />{" "}
                {errors.category}
              </p>
            )}
          </div>

          {/* Marca */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-gray-700">
                Marca
              </label>
              <button
                type="button"
                onClick={() => toast("Abrir modal de nueva marca")}
                className="flex items-center text-indigo-600 hover:underline text-sm"
              >
                <FiPlusCircle size={18} className="mr-1" /> Nueva
              </button>
            </div>
            <select
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.brand ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="">Selecciona una marca</option>
              {brands.map(({ id, nombre }, index) => (
                <option key={`${nombre}-${index}`} value={id}>
                  {nombre}
                </option>
              ))}
            </select>
            {errors.brand && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <AiOutlineExclamationCircle size={16} className="mr-1" />{" "}
                {errors.brand}
              </p>
            )}
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              URL Imagen
            </label>
            <input
              type="text"
              name="image"
              value={product.image}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.image ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="https://..."
            />
            {errors.image && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <AiOutlineExclamationCircle size={16} className="mr-1" />{" "}
                {errors.image}
              </p>
            )}
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
