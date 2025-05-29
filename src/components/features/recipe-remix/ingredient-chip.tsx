// src/components/features/recipe-remix/ingredient-chip.tsx
"use client";

import { X } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface IngredientChipProps {
  ingredient: string;
  onRemove: (ingredient: string) => void;
}

export function IngredientChip({ ingredient, onRemove }: IngredientChipProps) {
  // Simple slug function for image hint
  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

  return (
    <Badge variant="secondary" className="flex items-center gap-2 py-1.5 px-3 text-sm rounded-full shadow-sm h-10">
      <Image
        src={`https://placehold.co/24x24.png?text=${ingredient.charAt(0).toUpperCase()}`}
        alt={ingredient}
        width={24}
        height={24}
        className="rounded-full"
        data-ai-hint={`${slugify(ingredient)} food`}
      />
      <span className="capitalize">{ingredient}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 rounded-full hover:bg-muted-foreground/20"
        onClick={() => onRemove(ingredient)}
        aria-label={`Remove ${ingredient}`}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </Badge>
  );
}
