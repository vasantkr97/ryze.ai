import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    iconClassName?: string;
    withText?: boolean;
}

export function Logo({ className, iconClassName, withText = false }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="relative group">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
                    <TrendingUp className={cn("h-5 w-5 text-primary-foreground", iconClassName)} />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {withText && (
                <div className="flex flex-col">
                    <span className="font-bold text-lg tracking-tight text-foreground">Linkrunner.ai</span>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium -mt-1">AI Platform</span>
                </div>
            )}
        </div>
    );
}
