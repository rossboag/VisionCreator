import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, LogIn } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold sm:text-6xl">
            Welcome to VisionCreator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create stunning designs with the power of AI. Bring your ideas to life quickly and easily.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/signin">
                <LogIn className="mr-2 h-4 w-4" /> Log In
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8">
            <Button asChild variant="link" size="sm">
              <Link href="/admin/signin">Admin Login</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

