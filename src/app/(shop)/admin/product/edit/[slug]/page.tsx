"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiSave, FiTrash2 } from "react-icons/fi";
import { getProductDetail, getCategories, getBrands } from "@/actions";
import { Select, TextField } from "@/components";
import Textarea from "@/components/ui/Textarea";
import Image from "next/image";

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
  imagenes: { id: number; url: string }[];
};

type Opcion = { id: number; nombre: string };

export default function EditProductPage() {
  const { slug } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [marcas, setMarcas] = useState<Opcion[]>([]);
  const [categorias, setCategorias] = useState<Opcion[]>([]);

  useEffect(() => {
    (async () => {
      const [productDetailDB, marcasDB, categoriasDB] = await Promise.all([
        getProductDetail(slug as string),
        getCategories(),
        getBrands(),
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

  const handleDeleteImage = (id: number) => {
    if (!producto) return;
    const imagenesFiltradas = producto.imagenes.filter((img) => img.id !== id);
    setProducto({ ...producto, imagenes: imagenesFiltradas });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/productos/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });
      if (res.ok) {
        alert("Producto actualizado");
      } else {
        alert("Error al guardar");
      }
    } catch (error) {
      console.error(error);
      alert("Error al guardar producto");
    }
  };

  if (loading) return <div className="p-6">Cargando producto...</div>;
  if (!producto)
    return <div className="p-6 text-red-600">Producto no encontrado</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>

      <div className="space-y-5">
        <TextField
          label="Nombre"
          name="nombre"
          value={producto.nombre}
          onChange={handleChange}
        />

        <Textarea
          label="Descripción"
          name="descripcion"
          value={producto.descripcion}
          onChange={handleChange}
        />

        <TextField
          label="Precio"
          type="number"
          name="precio"
          value={producto.precio.toString()}
          onChange={handleChange}
        />

        <TextField
          label="Stock"
          type="number"
          name="stock"
          value={producto.stock.toString()}
          onChange={handleChange}
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
          />
        )}

        {/* Carrusel de Imágenes */}
        <div>
          <span className="block text-sm font-medium mb-2">
            Imágenes del producto
          </span>
          <div className="flex overflow-x-auto gap-4">
            {producto.imagenes.map((img) => (
              <div
                key={img.id}
                className="relative w-40 h-40 border rounded-lg overflow-hidden"
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
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                  title="Eliminar imagen"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          <FiSave size={18} /> Guardar cambios
        </button>
      </div>
    </div>
  );
}
