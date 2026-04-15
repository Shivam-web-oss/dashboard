import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"

interface Props {
  params: Promise<{ business: string }>
}

export default async function BusinessPage({ params }: Props) {
  const { business } = await params

  const { data: biz, error: bizError } = await supabase
  .from("business")        // ✅ correct table name
  .select("*")
  .eq("id", business)      // ✅ business is already a string, uuid matches
  .single()

  console.log("biz:", biz)
  console.log("bizError:", bizError)

  if (bizError || !biz) return notFound()

  const { data: shops } = await supabase
    .from("shops")
    .select("*")
    .eq("business_id", business)
    .order("created_at", { ascending: false })

  console.log("👉 biz:", biz)
  console.log("👉 bizError:", bizError)

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Business Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{biz.shop_name}</h1>
          <p className="text-gray-500 mt-1">{biz.company_name} · 📍 {biz.location}</p>
        </div>

        {/* Shops List */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Shops</h2>

        {shops?.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No shops found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops?.map((shop) => (
              <Link
                key={shop.shopid}
                href={`/dashboard/${business}/${shop.shopid}`}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                    {shop.shopname.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {shop.shopname}
                    </h2>
                    <p className="text-sm text-gray-500">{shop.address ?? "No address"}</p>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-400">
                  Created {new Date(shop.created_at).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}