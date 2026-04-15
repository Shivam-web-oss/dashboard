import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"

interface Product {
  name: string
  price: number
  description?: string
}

interface Props {
  params: Promise<{ business: string; bots: string }>
}

export default async function ShopPage({ params }: Props) {
  const { business, bots } = await params

  const { data: biz, error: bizError } = await supabase
    .from("dashboards")
    .select("shop_name, company_name")
    .eq("id", business)
    .single()

  if (bizError || !biz) return notFound()

  const { data: shop, error } = await supabase
    .from("shops")
    .select("*")
    .eq("shopid", bots)
    .single()

  if (error || !shop) return notFound()

  const products: Product[] = Array.isArray(shop.products) ? shop.products : []

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link
            href={`/dashboard/${business}`}
            className="hover:text-indigo-600 transition-colors"
          >
            {biz?.shop_name ?? "Business"}
          </Link>
          <span>/</span>
          <span className="text-gray-700">{shop.shopname}</span>
        </div>

        {/* Shop Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-5 mb-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
              {shop.shopname.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{shop.shopname}</h1>
              <p className="text-gray-500">📍 {shop.address ?? "No address"}</p>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Created {new Date(shop.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Products</h2>
            <span className="bg-indigo-50 text-indigo-600 text-sm font-medium px-3 py-1 rounded-full">
              {products.length} total
            </span>
          </div>

          {products.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No products yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <div key={index} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <span className="text-indigo-600 font-semibold">₹{product.price}</span>
                  </div>
                  {product.description && (
                    <p className="text-sm text-gray-500">{product.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}