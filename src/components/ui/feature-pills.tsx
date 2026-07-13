interface FeaturePillsProps {
  features?: string[];
}

export function FeaturePills({ features = ["Real-time AI", "Smart Navigation", "Crowd Insights", "Accessibility"] }: FeaturePillsProps) {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-3" role="list" aria-label="Key features">
      {features.map((feature) => (
        <span
          key={feature}
          className="rounded-full bg-white/70 px-4 py-1.5 text-xs font-medium text-gray-700 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-sm"
          role="listitem"
        >
          {feature}
        </span>
      ))}
    </div>
  );
}
