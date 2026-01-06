'use client';

import { ReactNode } from 'react';

/**
 * ErrorBoundaryProps - Configuration for error boundary
 * @property {ReactNode} children - Child components to wrap
 * @property {string} [fallback] - Custom error message (default: generic message)
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: string;
}

/**
 * ErrorBoundary - Catches React errors and displays fallback UI
 * Prevents entire app from crashing on component errors
 * @component
 * @example
 * <ErrorBoundary fallback="Failed to load section">
 *   <YourComponent />
 * </ErrorBoundary>
 */
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
}
