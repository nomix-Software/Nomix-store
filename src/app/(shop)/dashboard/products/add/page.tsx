"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { ImageInput, LoadingOverlay, Modal, Select, TextField } from "@/components";
import Textarea from "@/components/ui/Textarea";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";

const AddProductPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/auth/login");
    } else if (session.user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [session, status, router]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock:"",
    images: [] as unknown as { url: string; id: number }[],
  });
  const [categories, setCategories] = useState<CategoriesItem[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [brands, setBrands] = useState<BrandsItem[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<{ loading:boolean, message:string}>({ loading:true, message:'Obteniendo Marcas y Categorías'})

  useEffect(() => {
    (async () => {
      const categoriesItems = await getCategories();
      const brandsItems = await getBrands();
      setCategories(categoriesItems);
      setBrands(brandsItems);
      setIsLoading({loading:false, message:''})
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

  const handleDeleteImage = (fileName: string) => {
    if (!product) return;
    const imagenesFiltradas = images.filter((img) => img.name !== fileName);
    setImages(imagenesFiltradas);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setIsLoading({loading:true, message: 'Cargando producto...'})
      e.preventDefault();
      const formData = new FormData();
      images.forEach((file) => {
        formData.append("images", file);
      });
      let savedImages;
      try {
        savedImages = await uploadImagesToCloudinary(formData);
            } catch (imgError: unknown) {
        // Errores de validación de imágenes
        if (imgError instanceof Error && imgError.message) {
          setErrors({ image: imgError.message });
          toast.error(imgError.message);
        } else {
          toast.error("Error al subir imágenes. Intenta de nuevo.");
        }
        setIsLoading({loading:false, message:''});
        return;
      }
      if (!savedImages) {
        toast.error("Revisa los errores del formulario.");
        setIsLoading({loading:false, message:''});
        return;
      }
      await createProduct({ ...product, images: savedImages });
      toast.success("Producto agregado correctamente.");
      setErrors({});
        } catch (error: unknown) {
      // Manejo de errores de validación de zod
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string" &&
        (
          (error as { message: string }).message.includes('obligatorio') ||
          (error as { message: string }).message.includes('válido') ||
          (error as { message: string }).message.includes('mayor a 0')
        )
      ) {
        const errorArr = (error as { message: string }).message.split(' | ');
        const newErrors: { [key: string]: string } = {};
        errorArr.forEach((msg: string) => {
          if (msg.toLowerCase().includes('nombre')) newErrors.name = msg;
          else if (msg.toLowerCase().includes('descripción')) newErrors.description = msg;
          else if (msg.toLowerCase().includes('precio')) newErrors.price = msg;
          else if (msg.toLowerCase().includes('stock')) newErrors.stock = msg;
          else if (msg.toLowerCase().includes('categoría')) newErrors.category = msg;
          else if (msg.toLowerCase().includes('marca')) newErrors.brand = msg;
          else if (msg.toLowerCase().includes('imagen')) newErrors.image = msg;
        });
        setErrors(newErrors);
        toast.error("Revisa los errores del formulario.");
      } else {
        toast.error("Ocurrió un error, intente de nuevo más tarde");
      }
    }
    setIsLoading({loading:false, message:''})
  };
  //   const categories = ["Pañales", "Higiene", "Accesorios"];
  //   const brands = ["Huggies", "Pampers", "Johnson's"];
if(isLoading.loading) return <LoadingOverlay text={isLoading.message} />
return (
  <div className="p-6 max-w-3xl !mx-auto">
    <h1 className="!text-3xl !font-extrabold !flex !items-center !gap-2 !mb-6 !text-[#324d67] !justify-center">
      Nuevo producto
    </h1>

    <div className="!bg-white !rounded-2xl !shadow-sm !border !border-gray-100 !w-full !px-4 !py-6 sm:!px-8 sm:!py-8 !space-y-5">
      <form onSubmit={handleSubmit} className="!space-y-5">
        <TextField
          label="Nombre"
          name="name"
          value={product.name}
          onChange={handleChange}
          errors={errors}
          helperText="Nombre identificatorio del producto."
          placeholder="Ej: Pañal Huggies"
          className="!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !text-base !text-gray-800 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
        />

        <Textarea
          label="Descripción"
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Breve descripción del producto"
          helperText="Detalle del producto, presentación, unidades, etc."
 className="!mt-1 !block !w-full !border !border-gray-200 !rounded-2xl !shadow-sm !p-3 !text-base !text-gray-800 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white !resize"        />

        <TextField
          type="number"
          name="price"
          label="Precio ($)"
          helperText="Precio del producto en pesos."
          value={product.price}
          onChange={handleChange}
          placeholder="Ej: 1999.99"
          errors={errors}
          className="!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !text-base !text-gray-800 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
        />

        <TextField
          type="number"
          name="stock"
          label="Stock"
          helperText="Stock inicial"
          value={product.stock}
          onChange={handleChange}
          placeholder="3"
          errors={errors}
          className="!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !text-base !text-gray-800 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
        />

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
              buttonLabel="+"
              title="Crear nueva marca"
            />
          }
        />

        <ImageInput
          multiple
          label="Agrega una imagen"
          errors={errors}
          onChange={(e) => {
            if (!e.target.files?.length) return;
            setImages([...images, ...Array.from(e.target.files)]);
            e.target.value = "";
          }}
        />

        {images.length > 0 && (
          <div className="mt-4">
            <h2 className="!text-base !font-semibold !mb-2 !text-[#324d67]">
              Imágenes del producto
            </h2>
            <div className="flex overflow-x-auto gap-4">
              {images.map((file, index) => (
                <div
                  key={`${index}-${file.name}`}
                  className="relative w-40 h-40 border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
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
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full cursor-pointer shadow"
                    title="Eliminar imagen"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="!w-full cursor-pointer !bg-[#f02d34] !text-white !p-3 !rounded-full !font-semibold !text-base !shadow-sm hover:!bg-[#d12a2f] !transition disabled:!opacity-60 disabled:!cursor-not-allowed !mt-2"
        >
          Guardar producto
        </button>
      </form>
    </div>
  </div>
);

};

export default AddProductPage;
