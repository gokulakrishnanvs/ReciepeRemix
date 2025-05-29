// src/components/features/recipe-remix/recipe-card.tsx
"use client";

import Image from 'next/image';
import { Clock, Soup, Users, Eye, Star, CheckCircle } from 'lucide-react';
import type { Recipe, StoredRecipe } from '@/types/recipe';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe | StoredRecipe; // Can be a newly generated or stored recipe
  onViewDetails: (recipe: Recipe | StoredRecipe) => void;
  isSaved?: boolean; // Optional prop to indicate if it's from "My Recipes"
}

export function RecipeCard({ recipe, onViewDetails, isSaved }: RecipeCardProps) {
  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');
  const imageHint = recipe.recipeName ? slugify(recipe.recipeName) : 'food cooking';

  return (
    <Card className="w-full mx-auto overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="relative h-56 w-full group">
          <Image
            src={`https://placehold.co/600x400.png?text=${encodeURIComponent(recipe.recipeName)}`}
            alt={recipe.recipeName}
            layout="fill"
            objectFit="cover"
            data-ai-hint={imageHint.substring(0, 50)} // Max 2 words for hint, keep it short
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-75 group-hover:opacity-50 transition-opacity duration-300" />
            {isSaved && (
                <Badge variant="default" className="absolute top-3 right-3 bg-green-600 text-white">
                    <CheckCircle className="h-4 w-4 mr-1.5" /> Saved
                </Badge>
            )}
        </div>
        <div className="p-6 pb-2">
          <CardTitle className="text-2xl font-bold mb-1 line-clamp-2 leading-tight h-[3.75rem]">{recipe.recipeName}</CardTitle>
          <CardDescription className="flex items-center text-muted-foreground text-sm">
            <Soup className="h-4 w-4 mr-1.5 text-primary" /> 
            {'ingredients' in recipe && Array.isArray((recipe as StoredRecipe).ingredients) 
              ? `${(recipe as StoredRecipe).ingredients.length} ingredients`
              : "Generated for you!"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-6 space-y-4 flex-grow">
        <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
          {[
            { icon: Clock, label: "Prep Time", value: recipe.estimatedPrepTime },
            { icon: Clock, label: "Cook Time", value: recipe.estimatedCookTime },
            { icon: Users, label: "Servings", value: recipe.servingSize }
          ].map((item, index) => item.value ? (
            <div key={index} className="flex flex-col items-center text-center p-2 bg-secondary/50 rounded-md">
              <item.icon className="h-5 w-5 mb-1 text-accent" />
              <p className="font-semibold text-foreground/90">{item.label}</p>
              <p className="text-muted-foreground">{item.value}</p>
            </div>
          ) : null)}
        </div>
         {'ingredients' in recipe && Array.isArray((recipe as StoredRecipe).ingredients) && (recipe as StoredRecipe).ingredients.length > 0 && (
            <div className="mt-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Key Ingredients:</p>
                <div className="flex flex-wrap gap-1.5">
                    {(recipe as StoredRecipe).ingredients.slice(0, 5).map(ing => (
                        <Badge key={ing} variant="outline" className="text-xs capitalize">{ing}</Badge>
                    ))}
                    {(recipe as StoredRecipe).ingredients.length > 5 && <Badge variant="outline" className="text-xs">...</Badge>}
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter className="px-6 pb-6 mt-auto">
        <Button onClick={() => onViewDetails(recipe)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-3">
          <Eye className="mr-2 h-5 w-5" />
          View Full Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}
