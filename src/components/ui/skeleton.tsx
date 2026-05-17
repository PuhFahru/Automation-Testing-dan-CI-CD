import * as React from 'react';
import { cn } from '../../lib/utils';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };