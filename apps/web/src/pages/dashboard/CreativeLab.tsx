import { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Image,
  Type,
  Video,
  RefreshCw,
  Download,
  Copy,
  Heart,
  Trash2,
  Plus,
  Eye,
  TrendingUp,
  Zap,
  MessageSquare,
  Layout,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Creative types
const creativeTypes = [
  { id: 'image', name: 'Static Image', icon: Image, description: 'Single image ads' },
  { id: 'carousel', name: 'Carousel', icon: Layout, description: 'Multi-image ads' },
  { id: 'video', name: 'Video', icon: Video, description: 'Video ads' },
  { id: 'copy', name: 'Ad Copy', icon: Type, description: 'Headlines & descriptions' },
];

// Generated creatives mock
const generatedCreatives = [
  {
    id: 1,
    type: 'copy',
    title: 'Summer Sale Headlines',
    content: [
      { text: 'Transform Your Business in 30 Days', score: 92 },
      { text: 'Join 50,000+ Happy Customers', score: 88 },
      { text: 'Limited Time: 40% Off Everything', score: 85 },
    ],
    generatedAt: '2 hours ago',
    liked: true,
  },
  {
    id: 2,
    type: 'copy',
    title: 'Product Description Variants',
    content: [
      { text: 'Streamline your workflow with AI-powered automation. Save 20+ hours per week.', score: 90 },
      { text: 'The all-in-one platform that scales with your business. Start free today.', score: 87 },
      { text: 'Trusted by Fortune 500 companies. See why industry leaders choose us.', score: 84 },
    ],
    generatedAt: '3 hours ago',
    liked: false,
  },
  {
    id: 3,
    type: 'image',
    title: 'Product Showcase Concepts',
    content: [
      { preview: 'bg-gradient-to-br from-slate-600 to-slate-700', score: 94 },
      { preview: 'bg-gradient-to-br from-cyan-700 to-teal-600', score: 89 },
      { preview: 'bg-gradient-to-br from-amber-600 to-orange-500', score: 86 },
    ],
    generatedAt: '1 day ago',
    liked: true,
  },
];

// Best performing creatives
const topPerformers = [
  {
    id: 1,
    name: 'Summer Sale - Hero',
    type: 'image',
    platform: 'Meta Ads',
    ctr: 4.2,
    conversions: 234,
    spend: 2400,
    preview: 'bg-gradient-to-br from-teal-600 to-cyan-700',
  },
  {
    id: 2,
    name: 'Product Demo Video',
    type: 'video',
    platform: 'Google Ads',
    ctr: 3.8,
    conversions: 189,
    spend: 1800,
    preview: 'bg-gradient-to-br from-slate-500 to-slate-600',
  },
  {
    id: 3,
    name: 'Testimonial Carousel',
    type: 'carousel',
    platform: 'Meta Ads',
    ctr: 3.5,
    conversions: 156,
    spend: 1500,
    preview: 'bg-gradient-to-br from-emerald-600 to-teal-700',
  },
];

// AI suggestions
const aiSuggestions = [
  {
    title: 'Refresh "Brand Awareness" creatives',
    reason: 'CTR has declined 18% over 2 weeks. Ad fatigue detected.',
    action: 'Generate new variants',
  },
  {
    title: 'Test UGC-style video ads',
    reason: 'Competitors seeing 2x engagement with authentic content.',
    action: 'Create video concept',
  },
  {
    title: 'Add urgency to Summer Sale copy',
    reason: 'Time-limited offers show 35% higher conversion rates.',
    action: 'Generate copy variants',
  },
];

export default function CreativeLab() {
  const [selectedType, setSelectedType] = useState('copy');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creative Lab</h1>
          <p className="text-muted-foreground">
            AI-powered creative generation for your ad campaigns.
          </p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* AI Generator */}
      <Card className="border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/90 p-2">
              <Wand2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>AI Creative Generator</CardTitle>
              <CardDescription>Describe what you want to create</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Creative Type Selection */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {creativeTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:border-primary',
                  selectedType === type.id && 'border-primary bg-primary/10'
                )}
              >
                <type.icon
                  className={cn(
                    'h-6 w-6',
                    selectedType === type.id ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <div className="text-center">
                  <p className="text-sm font-medium">{type.name}</p>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe your creative</label>
            <div className="flex gap-2">
              <Input
                placeholder={
                  selectedType === 'copy'
                    ? 'E.g., "Write compelling headlines for a summer sale campaign targeting young professionals"'
                    : 'E.g., "Create a product showcase image with a modern, minimalist style"'
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleGenerate} disabled={isGenerating || !prompt}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Options */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Quick prompts:</span>
            {[
              'High-converting headlines',
              'Product benefits copy',
              'Social proof messaging',
              'Urgency/scarcity copy',
            ].map((quickPrompt) => (
              <button
                key={quickPrompt}
                onClick={() => setPrompt(quickPrompt)}
                className="rounded-full border px-3 py-1 text-xs hover:border-primary hover:text-primary"
              >
                {quickPrompt}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <CardTitle>AI Suggestions</CardTitle>
          </div>
          <CardDescription>Recommendations based on your campaign performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="rounded-lg border p-4">
                <h4 className="font-semibold">{suggestion.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{suggestion.reason}</p>
                <Button variant="outline" size="sm" className="mt-3">
                  {suggestion.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Creatives */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Generations</CardTitle>
              <CardDescription>Your AI-generated creative assets</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {generatedCreatives.map((creative) => (
            <div key={creative.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {creative.type === 'copy' && <Type className="h-4 w-4 text-muted-foreground" />}
                  {creative.type === 'image' && <Image className="h-4 w-4 text-muted-foreground" />}
                  <span className="font-medium">{creative.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{creative.generatedAt}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(creative.liked && 'text-red-500')}
                  >
                    <Heart className="h-4 w-4" fill={creative.liked ? 'currentColor' : 'none'} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {creative.content.map((item: any, index) => (
                  <div
                    key={index}
                    className="group relative rounded-lg border p-3 transition-all hover:border-primary"
                  >
                    {creative.type === 'copy' ? (
                      <p className="text-sm">{item.text}</p>
                    ) : (
                      <div
                        className={cn(
                          'aspect-video rounded-lg flex items-center justify-center',
                          item.preview
                        )}
                      >
                        <Image className="h-8 w-8 text-white/50" />
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="font-medium">{item.score}</span>
                        <span className="text-muted-foreground">predicted score</span>
                      </span>
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Performing Creatives */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Creatives</CardTitle>
          <CardDescription>Your best-performing ad creatives this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {topPerformers.map((creative) => (
              <div key={creative.id} className="rounded-lg border p-4">
                <div className={cn('aspect-video rounded-lg mb-3', creative.preview)} />
                <h4 className="font-semibold">{creative.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {creative.type} • {creative.platform}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold">{creative.ctr}%</p>
                    <p className="text-xs text-muted-foreground">CTR</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{creative.conversions}</p>
                    <p className="text-xs text-muted-foreground">Conversions</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">${(creative.spend / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">Spend</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Copy className="mr-1 h-3 w-3" />
                    Duplicate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Creative Tips */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Creative Best Practices</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Use clear, benefit-focused headlines that address customer pain points</li>
                <li>• Include social proof elements (reviews, testimonials, customer counts)</li>
                <li>• Test multiple creative variants - aim for at least 3-5 per ad set</li>
                <li>• Refresh creatives every 2-3 weeks to combat ad fatigue</li>
                <li>• Match creative style to platform (professional on LinkedIn, casual on TikTok)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
