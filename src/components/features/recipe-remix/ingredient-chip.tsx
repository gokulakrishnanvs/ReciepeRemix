"use client";

import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface IngredientChipProps {
  ingredient: string;
  onRemove: (ingredient: string) => void;
}

export function IngredientChip({ ingredient, onRemove }: IngredientChipProps) {
  return (
    <Badge variant="secondary" className="flex items-center gap-2 py-1.5 px-3 text-sm rounded-full shadow-sm">
      <span>{ingredient}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 rounded-full hover:bg-muted-foreground/20"
        onClick={() => onRemove(ingredient)}
        aria-label={`Remove ${ingredient}`}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
}
