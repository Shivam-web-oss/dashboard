import { createClient } from '@/lib/server'
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ business: string; bots: string }>
}) {
  const { business: businessSlug, bots: botName } = await params  // ✅ await once
  const supabase = await createClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', businessSlug)
    .single()

  if (!business) return notFound()

  const { data: bot } = await supabase
    .from('bots')
    .select('*')
    .eq('business_id', business.id)
    .eq('name', botName)
    .single()

  if (!bot) return notFound()

  return (
    <div>
      <h1>{business.name}</h1>
      <h2>{bot.name}</h2>
    </div>
  )
}