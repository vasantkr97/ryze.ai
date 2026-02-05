import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ArrowRight, BarChart3, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toaster';
import { useAuthStore } from '@/stores/auth-store';
import { Logo } from '@/components/Logo';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

const features = [
  {
    icon: BarChart3,
    title: 'AI-Powered Analytics',
    description: 'Get deep insights into campaign performance',
  },
  {
    icon: Zap,
    title: 'Smart Automation',
    description: 'Automate optimizations with guardrails',
  },
  {
    icon: Target,
    title: 'Predictive Targeting',
    description: 'Find high-value audiences automatically',
  },
];

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
        variant: 'success',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:gap-16">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:flex-col lg:justify-center">
          <div className="space-y-8">
            {/* Logo and tagline */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Logo withText={false} className="scale-125 origin-left" />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">LinkRunner AI</h1>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Advertising Platform</p>
                </div>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The AI-powered platform that helps you optimize ad spend and maximize ROAS.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 rounded-xl border border-border/50 bg-card/30 p-4 transition-colors hover:bg-card/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-border/50 bg-card/30 p-4 text-center">
                <p className="text-2xl font-bold text-primary">4.2x</p>
                <p className="text-xs text-muted-foreground">Avg. ROAS</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/30 p-4 text-center">
                <p className="text-2xl font-bold text-primary">$2.1M</p>
                <p className="text-xs text-muted-foreground">Ad Spend Managed</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/30 p-4 text-center">
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
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
                <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                <CardDescription>Sign in to your Linkrunner.ai account</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 border-border/50 bg-background/50 focus:border-primary/50"
                    {...register('email')}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-11 border-border/50 bg-background/50 focus:border-primary/50"
                    {...register('password')}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full h-11 btn-premium" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  Start free trial
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
