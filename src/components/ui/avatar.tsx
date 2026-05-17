import * as React from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold text-white shadow-md transition-transform hover:scale-105',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Avatar.displayName = 'Avatar';

interface AvatarImageProps extends React.HTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    if (!src || hasError) return null;

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn('aspect-square h-full w-full object-cover', className)}
        onError={() => setHasError(true)}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = 'AvatarImage';

export { Avatar, AvatarImage };