'use client'
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useProducts } from "@/hooks/useProductos";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";
import { useSearchParams, useRouter } from "next/navigation";

// TODO: Obtener productos asociados a la promo desde la API
// Mantener seleccionados en localStorage para no perderlos al cambiar de página
const STORAGE_KEY = 'promo-productos-marcados';

export default function AsociarProductosPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const { productos, isLoading, isError } = useProducts(`/api/products?search=${encodeURIComponent(search)}&page=${page}`);
  // Estado: ids seleccionados y productos seleccionados (acumulativo)
  const [asociados, setAsociados] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [productosMarcados, setProductosMarcados] = useState<any[]>([]);

  // Guardar seleccionados en localStorage al cambiar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(asociados));
    }
  }, [asociados]);

  // Mantener productosMarcados acumulando los seleccionados aunque no estén en la página
  useEffect(() => {
    if (!Array.isArray(productos?.products)) return;
    setProductosMarcados(prev => {
      // Agregar productos seleccionados de la página actual
      const nuevos = productos.products.filter(
        p => asociados.includes(p._id) && !prev.some(pm => pm._id === p._id)
      );
      // Quitar los que hayan sido desmarcados
      const actualizados = [...prev, ...nuevos].filter(p => asociados.includes(p._id));
      return actualizados;
    });
  }, [asociados, productos]);

  const toggleProducto = (id: string) => {
    setAsociados(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  // Productos seleccionados (resumen acumulativo)
  const productosSeleccionados = useMemo(() => {
    // Ordenar según el orden de asociados
    return asociados
      .map(id => productosMarcados.find(p => p._id === id))
      .filter(Boolean);
  }, [asociados, productosMarcados]);

  // Productos no seleccionados (para el listado principal)
  const productosNoSeleccionados = useMemo(() => {
    if (!Array.isArray(productos?.products)) return [];
    return productos.products.filter(p => !asociados.includes(p._id));
  }, [asociados, productos]);

  const handleGuardar = () => {
    // Aquí iría la lógica para guardar la asociación en la base de datos
    alert("Productos asociados a la promoción (simulado)");
  };

  const [openResumen, setOpenResumen] = useState(true);
  return (
    <div className="!p-6 max-w-6xl !mx-auto">
      <div className="!mb-4">
        <Link href="/dashboard/promociones" className="!text-[#f02d34] underline cursor-pointer">← Volver a promociones</Link>
      </div>
      <h1 className="text-2xl font-bold !mb-4">Asociar productos a la promoción</h1>
      <div className="!mb-4">
        <SearchBar size="medium" path={undefined} />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Listado de productos */}
        <div className="flex-1 order-2 md:order-1">
          <Card className="!p-6 !mb-4 min-h-[120px]">
            {isLoading && <div className="text-gray-500">Cargando productos...</div>}
            {isError && <div className="text-red-600">Error al cargar productos.</div>}
            {!isLoading && !isError && productosNoSeleccionados.length === 0 && (
              <div className="text-gray-500">No hay productos disponibles.</div>
            )}
            {!isLoading && !isError && productosNoSeleccionados.length > 0 && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {productosNoSeleccionados.map(producto => (
                  <li key={producto._id} className="flex items-center gap-3 py-1">
                    <input
                      type="checkbox"
                      checked={asociados.includes(producto._id)}
                      onChange={() => toggleProducto(producto._id)}
                      id={`prod-${producto._id}`}
                      className="accent-[#f02d34] w-5 h-5 rounded focus:ring-2 focus:ring-[#f02d34]"
                    />
                    <label htmlFor={`prod-${producto._id}`} className="text-base text-gray-800 cursor-pointer select-none">
                      {producto.name}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          {productos?.totalPages > 1 && (
            <Pagination currentPage={productos.currentPage} totalPages={productos.totalPages} />
          )}
          {/* Botón guardar solo en mobile debajo del resumen */}
          <div className="block md:hidden">
            <Button onClick={handleGuardar} className="w-full !mt-2 cursor-pointer hover:!bg-[#f02d34] hover:!text-white transition-colors duration-200">Guardar cambios</Button>
          </div>
        </div>
        {/* Resumen de productos seleccionados */}
        {productosSeleccionados.length > 0 && (
          <div className="md:w-[340px] md:min-w-[280px] md:max-w-xs order-1 md:order-2">
            <Card className="!p-4 !mb-4 border-2 border-[#f02d34] bg-[#fff7f7] sticky !top-8 md:!top-24">
              <button
                className="flex items-center !gap-2 text-[#f02d34] font-semibold !mb-2 md:!mb-4 select-none cursor-pointer transition-colors duration-200  !px-2 !py-1 rounded"
                onClick={() => setOpenResumen(o => !o)}
                type="button"
                aria-expanded={openResumen}
              >
                Productos seleccionados
                {openResumen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
              </button>
              {openResumen && (
                <ul className="!space-y-2 max-h-64 overflow-y-auto !pr-1">
                  {productosSeleccionados.map(producto => (
                    <li key={producto._id} className="flex items-center !gap-2">
                      <span className="truncate flex-1">{producto.name}</span>
                      <Button
                        variant="secondary"
                        className="!px-2 !py-1 !text-xs cursor-pointer hover:!bg-[#f02d34] hover:!text-white transition-colors duration-200"
                        onClick={() => toggleProducto(producto._id)}
                      >Quitar</Button>
                    </li>
                  ))}
                </ul>
              )}
              {/* Botón guardar solo en desktop al costado */}
              <div className="hidden md:block mt-4">
                <Button onClick={handleGuardar} className="w-full cursor-pointer hover:!bg-[#f02d34] hover:!text-white transition-colors duration-200">Guardar cambios</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
