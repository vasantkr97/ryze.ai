import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle2, ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toaster';
import { useAuthStore } from '@/stores/auth-store';
import { Logo } from '@/components/Logo';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

type RegisterForm = z.infer<typeof registerSchema>;

const benefits = [
  {
    icon: TrendingUp,
    title: 'AI-powered campaign optimization',
    description: 'Automatically find and fix underperforming ads',
  },
  {
    icon: Zap,
    title: 'Automated execution with guardrails',
    description: 'Safe automation that respects your rules',
  },
  {
    icon: Shield,
    title: 'Predictive analytics & insights',
    description: 'Know what will happen before it does',
  },
];

const trustedBy = [
  { name: 'Google', logo: 'G' },
  { name: 'Meta', logo: 'M' },
  { name: 'LinkedIn', logo: 'in' },
  { name: 'TikTok', logo: 'T' },
];

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const register_ = useAuthStore((state) => state.register);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await register_(data.email, data.password, data.name);
      toast({
        title: 'Account created!',
        description: 'Welcome to Linkrunner.ai. Let\'s get started.',
        variant: 'success',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'An account with this email already exists.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:gap-16">
        {/* Left side - Benefits */}
        <div className="hidden lg:flex lg:flex-col lg:justify-center">
          <div className="space-y-8">
            {/* Headline */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Logo withText={false} className="scale-75 origin-left -ml-1" />
                14-day free trial
              </div>
              <h1 className="text-4xl font-bold tracking-tight leading-tight">
                Start optimizing your ads with AI
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join thousands of marketers who use LinkRunner AI to automate their advertising and improve performance.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4 rounded-xl border border-border/50 bg-card/30 p-4 transition-all hover:bg-card/50 hover:border-primary/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Integrates with</p>
              <div className="flex items-center gap-4">
                {trustedBy.map((brand) => (
                  <div
                    key={brand.name}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-card/30 text-sm font-bold text-muted-foreground"
                  >
                    {brand.logo}
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="rounded-xl border border-border/50 bg-card/30 p-6">
              <p className="text-sm leading-relaxed italic text-muted-foreground">
                "LinkRunner AI helped us improve our ROAS by 40% in the first month. The AI recommendations are spot-on and the automation saves us hours every week."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  JD
                </div>
                <div>
                  <p className="text-sm font-semibold">John Doe</p>
                  <p className="text-xs text-muted-foreground">Marketing Director, TechCorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto flex justify-center">
                <Logo withText={false} className="scale-150" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
                <CardDescription>Start your 14-day free trial - no credit card required</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="h-11 border-border/50 bg-background/50 focus:border-primary/50"
                    {...register('name')}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Work email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="h-11 border-border/50 bg-background/50 focus:border-primary/50"
                    {...register('email')}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className="h-11 border-border/50 bg-background/50 focus:border-primary/50"
                    {...register('password')}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3" /> 8+ characters
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3" /> Uppercase
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3" /> Number
                    </span>
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 btn-premium" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Start free trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </p>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
