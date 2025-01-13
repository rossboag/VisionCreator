'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AIOutput } from '@/components/ai-builder/ai-output'
import { useToast } from '@/hooks/use-toast'
import { DesignGenerationOptions, GeneratedDesign, GenerationStatus } from '@/types/ai'

const formSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  size: z.enum(['256x256', '512x512', '1024x1024']),
  complexity: z.number().min(0).max(100),
  useColor: z.boolean(),
  style: z.enum(['realistic', 'artistic', 'minimalist', 'abstract']).optional(),
})

export function AIBuilder() {
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle')
  const [generatedDesign, setGeneratedDesign] = useState<GeneratedDesign | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      size: '512x512',
      complexity: 50,
      useColor: true,
      style: 'artistic',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setGenerationStatus('generating')
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
      setGenerationStatus('success')
      
      toast({
        title: 'Design generated successfully',
        description: 'Your AI-generated design is ready!',
      })
    } catch (error) {
      console.error('Error generating design:', error)
      setGenerationStatus('error')
      toast({
        title: 'Error',
        description: 'Failed to generate design. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>AI Design Generator</CardTitle>
          <CardDescription>
            Describe your design idea and let AI bring it to life
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Design Description</Label>
              <Input
                id="prompt"
                placeholder="Describe the design you want to create..."
                {...form.register('prompt')}
              />
              {form.formState.errors.prompt && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.prompt.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select
                value={form.watch('style')}
                onValueChange={(value) => form.setValue('style', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="abstract">Abstract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Image Size</Label>
              <Select
                value={form.watch('size')}
                onValueChange={(value) => form.setValue('size', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select image size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="256x256">Small (256x256)</SelectItem>
                  <SelectItem value="512x512">Medium (512x512)</SelectItem>
                  <SelectItem value="1024x1024">Large (1024x1024)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Complexity</Label>
              <Slider
                value={[form.watch('complexity')]}
                onValueChange={([value]) => form.setValue('complexity', value)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Simple</span>
                <span>Complex</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={form.watch('useColor')}
                onCheckedChange={(checked) => form.setValue('useColor', checked)}
              />
              <Label>Use Color</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={generationStatus === 'generating'}
            >
              {generationStatus === 'generating' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Design
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {generatedDesign && (
        <div className="mt-8">
          <AIOutput design={generatedDesign} />
        </div>
      )}
    </div>
  )
}

