// import { createClient } from '@/lib/server'
// import { notFound } from 'next/navigation'

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ business: string; bots: string }>
// }) {
//   const { business: businessSlug, bots: botName } = await params  // ✅ await once
//   const supabase = await createClient()

//   const { data: business } = await supabase
//     .from('businesses')
//     .select('*')
//     .eq('slug', businessSlug)
//     .single()

//   if (!business) return notFound()

//   const { data: bot } = await supabase
//     .from('bots')
//     .select('*')
//     .eq('business_id', business.id)
//     .eq('name', botName)
//     .single()

//   if (!bot) return notFound()

//   return (
//     <div>
//       <h1>{business.name}</h1>
//       <h2>{bot.name}</h2>
      
//     </div>
//   )
// }

interface Props {
  params: {
    business: string
    dashboard: string
  }
}

export default function DashboardPage({ params }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🏪</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <div className="space-y-2 text-sm text-gray-500 mt-4">
          <p>Business: <span className="font-medium text-gray-800">{params.business}</span></p>
          <p>Dashboard: <span className="font-medium text-gray-800">{params.dashboard}</span></p>
        </div>
      </div>
    </div>
  )
}