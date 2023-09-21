import dynamic from 'next/dynamic'
const Profile = dynamic(() => import('@/components/wallet/Profile'), {ssr: false})
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Profile />
    </main>
  )
}
