'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Code2, Wand2, History, RotateCcw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ComponentVersion } from '@/lib/component-version-control'
import { ComponentPreview } from '@/components/admin/component-preview'

const promptSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  componentName: z.string().min(1, 'Component name is required'),
  description: z.string().optional(),
})

type PromptFormValues = z.infer<typeof promptSchema>

interface GeneratedComponent {
  code: string
  preview: string
  componentName: string
}

export function V0Integration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [generatedComponent, setGeneratedComponent] = useState<GeneratedComponent | null>(null)
  const [versions, setVersions] = useState<ComponentVersion[]>([])
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
  })

  useEffect(() => {
    const editComponentName = searchParams.get('edit')
    if (editComponentName) {
      loadComponent(editComponentName)
    }
  }, [searchParams])

  const loadComponent = async (componentName: string) => {
    try {
      const response = await fetch(`/api/admin/v0-components/${componentName}`)
      if (!response.ok) {
        throw new Error('Failed to load component')
      }
      const data = await response.json()
      setGeneratedComponent(data)
      setValue('componentName', data.componentName)
      setValue('prompt', data.prompt || '')
      setValue('description', data.description || '')
      await loadVersions(componentName)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load component. Please try again.",
        variant: "destructive",
      })
    }
  }

  const loadVersions = async (componentName: string) => {
    try {
      const response = await fetch(`/api/admin/v0-versions/${componentName}`)
      if (!response.ok) {
        throw new Error('Failed to load versions')
      }
      const data = await response.json()
      setVersions(data)
    } catch (error) {
      console.error('Error loading versions:', error)
      toast({
        title: "Error",
        description: "Failed to load component versions.",
        variant: "destructive",
      })
    }
  }

  const onSubmit = async (data: PromptFormValues) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/admin/v0-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to generate component')
      }

      const result = await response.json()
      setGeneratedComponent(result)
      await loadVersions(data.componentName)
      
      toast({
        title: "Component generated",
        description: "Your component has been generated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate component. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeploy = async () => {
    if (!generatedComponent) {
      toast({
        title: "Error",
        description: "No component generated to deploy.",
        variant: "destructive",
      })
      return
    }

    setIsDeploying(true)
    try {
      const response = await fetch('/api/admin/v0-deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentName: generatedComponent.componentName,
          code: generatedComponent.code,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to deploy component')
      }

      await loadVersions(generatedComponent.componentName)

      toast({
        title: "Component deployed",
        description: "Your component has been deployed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deploy component. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const handleRollback = async (versionId: string) => {
    if (!generatedComponent) return

    try {
      const response = await fetch('/api/admin/v0-rollback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentName: generatedComponent.componentName,
          versionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to rollback component')
      }

      const result = await response.json()
      setGeneratedComponent({
        ...generatedComponent,
        code: result.code,
      })

      toast({
        title: "Component rolled back",
        description: "Your component has been rolled back successfully.",
      })

      await loadVersions(generatedComponent.componentName)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rollback component. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>v0 Component Generator</CardTitle>
          <CardDescription>
            Generate new components or edit existing ones using v0.dev AI
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Component Name</label>
              <Input
                placeholder="e.g., ProductCard, UserDashboard"
                {...register('componentName')}
              />
              {errors.componentName && (
                <p className="text-sm text-red-500">{errors.componentName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Brief description of the component"
                {...register('description')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt</label>
              <Textarea
                placeholder="Describe the component you want to create or modify..."
                className="min-h-[100px]"
                {...register('prompt')}
              />
              {errors.prompt && (
                <p className="text-sm text-red-500">{errors.prompt.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Component
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {generatedComponent && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Component: {generatedComponent.componentName}</CardTitle>
            <CardDescription>
              Preview, edit, and deploy your generated component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="versions">Version History</TabsTrigger>
              </TabsList>
              <TabsContent value="preview">
                <ComponentPreview componentName={generatedComponent.componentName} />
              </TabsContent>
              <TabsContent value="code">
                <pre className="rounded-lg bg-muted p-4 overflow-auto">
                  <code className="text-sm">{generatedComponent.code}</code>
                </pre>
              </TabsContent>
              <TabsContent value="versions">
                <div className="space-y-4">
                  {versions.map((version) => (
                    <Card key={version.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              Version from {new Date(version.timestamp).toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              By {version.author}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRollback(version.id)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Rollback
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => loadVersions(generatedComponent.componentName)}>
              <History className="mr-2 h-4 w-4" />
              Refresh History
            </Button>
            <Button onClick={handleDeploy} disabled={isDeploying}>
              {isDeploying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Code2 className="mr-2 h-4 w-4" />
                  Deploy Component
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

