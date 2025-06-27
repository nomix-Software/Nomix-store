import { getProductsFiltered } from "@/actions";
import { NextResponse } from "next/server";

// En tu endpoint API
function parseQueryParam(param: string | string[] | null): string[] | undefined {
    if (!param) return undefined;
    if (Array.isArray(param)) return param;
    return [param]; // Si es string único, lo envolvemos en array
  }
  
  export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
  
    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || undefined;
    const marcas = parseQueryParam(searchParams.getAll("brand"));
    const categorias = parseQueryParam(searchParams.getAll("categorie"));
    const take = parseInt(searchParams.get("take") || "20", 10);

    try {
      const data = await getProductsFiltered({
        search,
        marcas,
        categorias,
        page: isNaN(page) ? 1 : page,
        take: isNaN(take) ? 20 : take,
      });
  
      const response = NextResponse.json(data);
      response.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=59");
      return response;
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Error al obtener productos filtrados" }, { status: 500 });
    }
  }
  