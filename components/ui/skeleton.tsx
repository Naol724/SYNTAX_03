'use client';

import { motion } from 'framer-motion';
import { cn } from './motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 0.5 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        variantClasses[variant],
        className
      )}
      style={{
        width: width,
        height: height || (variant === 'text' ? '1em' : undefined),
      }}
    />
  );
}

// Text skeleton
interface TextSkeletonProps {
  lines?: number;
  className?: string;
}

export function TextSkeleton({ lines = 3, className = '' }: TextSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn('w-full', i === lines - 1 && 'w-2/3')}
        />
      ))}
    </div>
  );
}

// Card skeleton
interface CardSkeletonProps {
  showImage?: boolean;
  showTitle?: boolean;
  showContent?: boolean;
  showFooter?: boolean;
}

export function CardSkeleton({
  showImage = true,
  showTitle = true,
  showContent = true,
  showFooter = true,
}: CardSkeletonProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {showImage && (
        <Skeleton variant="rectangular" className="w-full h-48" />
      )}
      <div className="p-6 space-y-4">
        {showTitle && (
          <div className="space-y-2">
            <Skeleton variant="text" className="w-3/4 h-6" />
            <Skeleton variant="text" className="w-1/2 h-4" />
          </div>
        )}
        {showContent && (
          <div className="space-y-2">
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-2/3" />
          </div>
        )}
        {showFooter && (
          <div className="flex gap-2 pt-2">
            <Skeleton variant="rounded" className="w-20 h-8" />
            <Skeleton variant="rounded" className="w-20 h-8" />
          </div>
        )}
      </div>
    </div>
  );
}

// Profile skeleton
interface ProfileSkeletonProps {
  showName?: boolean;
  showRole?: boolean;
  showBio?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
}

export function ProfileSkeleton({
  showName = true,
  showRole = true,
  showBio = true,
  avatarSize = 'md',
}: ProfileSkeletonProps) {
  const avatarSizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  return (
    <div className="flex items-start gap-4">
      <Skeleton variant="circular" className={avatarSizes[avatarSize]} />
      <div className="flex-1 space-y-3">
        {showName && <Skeleton variant="text" className="w-32 h-5" />}
        {showRole && <Skeleton variant="text" className="w-48 h-4" />}
        {showBio && (
          <div className="space-y-2">
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-3/4" />
          </div>
        )}
      </div>
    </div>
  );
}

// Stats skeleton
interface StatsSkeletonProps {
  columns?: number;
}

export function StatsSkeleton({ columns = 4 }: StatsSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
        >
          <Skeleton variant="circular" className="w-12 h-12 mx-auto mb-4" />
          <Skeleton variant="text" className="w-16 h-9 mx-auto mb-2" />
          <Skeleton variant="text" className="w-24 h-4 mx-auto" />
        </div>
      ))}
    </div>
  );
}

// Grid of cards skeleton
interface CardsGridSkeletonProps {
  count?: number;
  columns?: 2 | 3 | 4;
}

export function CardsGridSkeleton({
  count = 6,
  columns = 3,
}: CardsGridSkeletonProps) {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// Page loading skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero section skeleton */}
      <div className="py-24 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Skeleton variant="rounded" className="w-48 h-6 mx-auto" />
            <Skeleton variant="text" className="w-full h-14" />
            <Skeleton variant="text" className="w-3/4 h-6 mx-auto" />
            <div className="flex justify-center gap-3 mt-8">
              <Skeleton variant="rounded" className="w-36 h-12" />
              <Skeleton variant="rounded" className="w-36 h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="py-12 -mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsSkeleton columns={4} />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <Skeleton variant="rounded" className="w-32 h-5 mx-auto" />
              <Skeleton variant="text" className="w-96 h-10 mx-auto" />
            </div>
            <CardsGridSkeleton count={6} columns={3} />
          </div>
        </div>
      </div>
    </div>
  );
}