import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function SectionWrapper({ title, description, children, icon, className, contentClassName }: SectionWrapperProps) {
  return (
    <Card className={cn("shadow-lg w-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          {icon && <span className="text-primary">{icon}</span>}
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        </div>
        {description && <CardDescription className="text-md">{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn(contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
