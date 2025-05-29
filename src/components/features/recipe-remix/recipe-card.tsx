"use client";

import Image from 'next/image';
import { Clock, Soup, Users, Eye } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RecipeCardProps {
  recipe: Recipe;
  onViewDetails: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onViewDetails }: RecipeCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={`https://placehold.co/600x400.png?text=${encodeURIComponent(recipe.recipeName)}`}
            alt={recipe.recipeName}
            layout="fill"
            objectFit="cover"
            data-ai-hint="food cooking"
          />
        </div>
        <div className="p-6">
          <CardTitle className="text-2xl font-bold mb-2">{recipe.recipeName}</CardTitle>
          <CardDescription className="flex items-center text-muted-foreground mb-4">
            <Soup className="h-5 w-5 mr-2 text-primary" /> Generated just for you!
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {recipe.estimatedPrepTime && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-accent" />
              <div>
                <p className="font-semibold">Prep Time</p>
                <p className="text-muted-foreground">{recipe.estimatedPrepTime}</p>
              </div>
            </div>
          )}
          {recipe.estimatedCookTime && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-accent" />
              <div>
                <p className="font-semibold">Cook Time</p>
                <p className="text-muted-foreground">{recipe.estimatedCookTime}</p>
              </div>
            </div>
          )}
          {recipe.servingSize && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-accent" />
              <div>
                <p className="font-semibold">Servings</p>
                <p className="text-muted-foreground">{recipe.servingSize}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6">
        <Button onClick={() => onViewDetails(recipe)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Eye className="mr-2 h-4 w-4" />
          View Full Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}
