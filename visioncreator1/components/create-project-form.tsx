'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { AIDesignPreview } from '@/components/create-project/ai-design-preview'

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['image', 'video', 'text']),
  industry: z.string().min(1, 'Please select an industry'),
  style: z.string().min(1, 'Please select a style'),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface GeneratedDesign {
  imageUrl: string
  description: string
  metadata: {
    title: string
    type: string
    industry: string
    style: string
    generatedAt: string
  }
}

export function CreateProjectForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatedDesign, setGeneratedDesign] = useState<GeneratedDesign | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  })

  const onSubmit = async (data: ProjectFormValues) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to generate design')
      }

      const design: GeneratedDesign = await response.json()
      setGeneratedDesign(design)
      toast({
        title: "Design generated",
        description: "Your AI-powered design has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate design. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generatedDesign) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...generatedDesign,
          title: generatedDesign.metadata.title,
          type: generatedDesign.metadata.type,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save project')
      }

      const savedProject = await response.json()
      toast({
        title: "Project saved",
        description: "Your project has been saved successfully.",
      })
      router.push(`/projects/${savedProject.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea id="description" {...register('description')} />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Project Type</Label>
              <Select onValueChange={(value) => register('type').onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select onValueChange={(value) => register('industry').onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
              {errors.industry && <p className="text-sm text-red-500">{errors.industry.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Design Style</Label>
              <Select onValueChange={(value) => register('style').onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select design style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                  <SelectItem value="futuristic">Futuristic</SelectItem>
                  <SelectItem value="playful">Playful</SelectItem>
                </SelectContent>
              </Select>
              {errors.style && <p className="text-sm text-red-500">{errors.style.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Design'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <AIDesignPreview design={generatedDesign} onSave={handleSave} isSaving={isSaving} />
    </div>
  )
}

