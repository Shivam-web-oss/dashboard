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
  .eq("user_id", business)      // ✅ business is already a string, uuid matches
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
    <div className="min-h-screen py-10 px-4 max-w-5xl mx-auto">

      {/* ── Business Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-10">
        <div className="flex flex-col gap-1.5">
          {/* Tag */}
          <span className="flex items-center gap-1.5 text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            Business Profile
          </span>

          {/* Name */}
          <h1 className="text-[2rem] extrabold leading-tight text-white">
            {biz.company_name}
          </h1>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-[13px] text-gray-500 flex-wrap mt-0.5">
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <path d="M1 7h14M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {biz.shop_name}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5z" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              {biz.location}
            </span>
          </div>

          {/* Description */}
          {biz.description && (
            <p className="text-[13px] text-gray-500 leading-relaxed max-w-lg mt-1">
              {biz.description}
            </p>
          )}
        </div>

        {/* Shop count stat */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-center shrink-0">
          <div className="text-2xl font-semibold text-gray-900">{shops?.length ?? 0}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Total Shops</div>
        </div>
      </div>

      <hr className="border-gray-100 mb-6" />

      {/* ── Section Header ── */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400">
          Shops
        </span>
        <span className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
          Live
        </span>
      </div>

      {/* ── Shop Grid ── */}
      {!shops?.length ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
          No shops found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {shops.map((shop, i) => {
            return (
              <Link
                key={shop.shopid}
                href={`/dashboard/"${biz.business}"/${shop.shopid}`}
                className="group bg-white border border-gray-200 rounded-2xl p-5 flex flex-col hover:border-gray-400 hover:bg-gray-50 transition-all duration-150"
              >
                {/* Card top */}
                <div className="flex items-center gap-3 mb-3.5">
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[15px] font-semibold shrink-0"
                  >
                    {shop.shopname.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[15px] text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {shop.shopname}
                    </p>
                    <p className="text-[12px] text-gray-400 truncate mt-0.5">
                      {shop.address ?? "No address"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {shop.description && (
                  <p className="text-[12.5px] text-gray-500 leading-relaxed border-t border-gray-100 pt-3 mb-3 line-clamp-2">
                    {shop.description}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-1">
                  <span className="text-[11px] text-gray-300">
                    {new Date(shop.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[12px] text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  )
}