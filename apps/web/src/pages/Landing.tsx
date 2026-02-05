import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Brain,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Optimization',
    description:
      'Our AI analyzes millions of data points to automatically optimize your campaigns for maximum ROAS.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
  },
  {
    icon: Zap,
    title: 'Automated Execution',
    description:
      'Not just suggestions - Ryze AI actually executes changes with smart guardrails you control.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Analytics',
    description:
      'Predict performance drops 24-72 hours before they happen and take proactive action.',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400/10',
  },
  {
    icon: Target,
    title: 'Competitor Intelligence',
    description:
      'Track competitor ads, strategies, and market positioning to stay ahead.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10',
  },
  {
    icon: BarChart3,
    title: 'Full Funnel Tracking',
    description:
      'Track complete audience journeys from awareness to advocacy with multi-touch attribution.',
    color: 'text-violet-400',
    bgColor: 'bg-violet-400/10',
  },
  {
    icon: MessageSquare,
    title: 'Conversational AI',
    description:
      'Ask questions in natural language and get instant insights about your campaigns.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
];

const platforms = [
  'Google Ads',
  'Meta',
  'LinkedIn',
  'Amazon Ads',
  'TikTok',
  'Reddit',
  'Twitter/X',
];

const stats = [
  { value: '2,000+', label: 'Active Clients' },
  { value: '700+', label: 'Agencies' },
  { value: '$500M+', label: 'Ad Spend Managed' },
  { value: '45%', label: 'Avg. ROAS Improvement' },
];

const testimonials = [
  {
    quote:
      "Ryze AI saved us 20+ hours per week on campaign management while improving our ROAS by 63%.",
    author: 'Sarah Chen',
    role: 'Head of Growth, TechStartup',
    avatar: 'SC',
  },
  {
    quote:
      "The predictive analytics caught a conversion tracking issue before it cost us thousands. Game changer.",
    author: 'Michael Torres',
    role: 'Performance Marketing Lead',
    avatar: 'MT',
  },
  {
    quote:
      "Finally, an AI that actually executes changes instead of just making suggestions I have to implement.",
    author: 'Emily Watson',
    role: 'Agency Owner',
    avatar: 'EW',
  },
];

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 gradient-bg" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Ad Management
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your Ads on{' '}
              <span className="text-blue-600">Autopilot</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Ryze AI autonomously manages your advertising campaigns across all platforms.
              Real optimization, real execution, real results.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required. Instant access.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Platforms */}
      <section className="border-y bg-muted/30 py-8">
        <div className="container">
          <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
            WORKS WITH ALL MAJOR AD PLATFORMS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {platforms.map((platform) => (
              <div
                key={platform}
                className="text-lg font-semibold text-muted-foreground/60"
              >
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Everything You Need to Dominate Paid Advertising
            </h2>
            <p className="text-lg text-muted-foreground">
              Ryze AI goes beyond basic optimization. We provide a complete suite of
              AI-powered tools that work 24/7.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className={`mb-4 inline-flex rounded-lg p-3 ${feature.bgColor}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">How Ryze AI Works</h2>
            <p className="text-lg text-muted-foreground">
              Get started in minutes and let AI transform your advertising
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Connect Your Accounts',
                description: 'Link your ad platforms with one-click OAuth integration.',
              },
              {
                step: '2',
                title: 'AI Analyzes Everything',
                description: 'Our AI audits your campaigns and identifies opportunities.',
              },
              {
                step: '3',
                title: 'Automated Optimization',
                description: 'Approve or auto-execute recommendations with smart guardrails.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white shadow-lg shadow-purple-900/20">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Loved by Marketing Teams
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our customers have to say about Ryze AI
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <p className="mb-6 text-lg">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white shadow-md shadow-purple-900/20">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground">
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Ready to Transform Your Advertising?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
                Join 2,000+ companies using Ryze AI to automate their ad management
                and improve ROAS.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm opacity-80">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Instant Access
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Cancel anytime
                </span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          </div>
        </div>
      </section>
    </div>
  );
}
