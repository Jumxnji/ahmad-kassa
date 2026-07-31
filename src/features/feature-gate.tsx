import { isFeatureEnabled, type FeatureFlag } from "@/features/flags";

interface FeatureGateProps {
  flag: FeatureFlag;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/** Renders `children` only when the given flag is enabled. */
export function FeatureGate({ flag, children, fallback = null }: FeatureGateProps) {
  return isFeatureEnabled(flag) ? <>{children}</> : <>{fallback}</>;
}
