import { Star } from "lucide-react";
import Image from "next/image";

const PLACEHOLDER_AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
];

interface SocialProofProps {
  text?: string;
}

export function SocialProof({ text = "Trusted by 200+ stadiums worldwide" }: SocialProofProps) {
  return (
    <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6" aria-label="User testimonials">
      <div className="flex -space-x-2">
        {PLACEHOLDER_AVATARS.map((avatar, index) => (
          <div key={index} className="relative size-10 rounded-full border-2 border-white ring-2 ring-orange-500/20">
            <Image
              src={avatar}
              alt={`User avatar ${index + 1}`}
              fill
              className="rounded-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center sm:items-start">
        <div className="flex items-center gap-1 text-orange-500" aria-label="5 star rating">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="size-4 fill-current" aria-hidden="true" />
          ))}
        </div>
        <span className="mt-0.5 text-sm font-medium text-gray-700">{text}</span>
      </div>
    </div>
  );
}
