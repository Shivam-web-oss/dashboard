import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface Props {
  params: {
    business: string
    dashboard: string
  }
}

export default async function BusinessesPage({ params }: Props) {
  const { data: businesses, error } = await supabase
    .from("dashboards")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load businesses: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{params.business}</h1>
        <p className="text-gray-500">Welcome to your dashboard</p>

        {businesses?.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No businesses found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses?.map((biz) => (
              <Link
                key={biz.id}
                href={`/dashboard/business/${biz.id}`}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                    {biz.shop_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {biz.shop_name}
                    </h2>
                    <p className="text-sm text-gray-500">{biz.company_name}</p>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-500">
                  <p>📍 {biz.location}</p>
                  {biz.description && (
                    <p className="line-clamp-2 text-gray-600 mt-2">{biz.description}</p>
                  )}
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  Joined {new Date(biz.created_at).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}