'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '@/lib/useAuth'
import { Wrapper } from '../wrapper'

const DashboardComponent = dynamic(() => import('@/components/dashboard').then(mod => mod.DashboardComponent), { ssr: false })

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
      <Wrapper>
        <DashboardComponent />
      </Wrapper>
  )
}
