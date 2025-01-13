import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DeploymentStatusProps {
  initialStatus: string
}

export default function DeploymentStatus({ initialStatus }: DeploymentStatusProps) {
  const [status, setStatus] = useState(initialStatus)

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch('/api/deployment-status')
      const data = await res.json()
      setStatus(data.status)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Deployment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{status}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session || session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/deployment-status`)
  const data = await res.json()

  return {
    props: {
      initialStatus: data.status,
    },
  }
}

