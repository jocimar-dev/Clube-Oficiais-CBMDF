type AnalyticsPropertyValue = string | number | boolean | null | undefined;

interface Window {
  trackVercelEvent?: (name: string, properties?: Record<string, AnalyticsPropertyValue>) => void;
}
