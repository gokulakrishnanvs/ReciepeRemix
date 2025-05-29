
"use client";

import type { Recipe } from '@/types/recipe';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Clock, Users, Soup, ChefHat } from 'lucide-react';

interface RecipeDetailDialogProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecipeDetailDialog({ recipe, isOpen, onOpenChange }: RecipeDetailDialogProps) {
  if (!recipe) return null;

  // Process instructions:
  // 1. Split by newline.
  // 2. For each line, remove any leading "number." pattern (e.g., "1. ", "02. "), then trim whitespace.
  // 3. Filter out any lines that are now empty.
  const processedInstructions = recipe.instructions
    .split('\n')
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(line => line !== '');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-3xl font-bold text-primary flex items-center">
            <ChefHat className="h-8 w-8 mr-3 shrink-0" />
            {recipe.recipeName}
          </DialogTitle>
          <DialogDescription className="text-md text-muted-foreground mt-1">
            Discover the steps to create this delicious meal.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {recipe.estimatedPrepTime && (
                <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                  <Clock className="h-5 w-5 mr-2 text-accent shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Prep Time</p>
                    <p className="text-sm text-muted-foreground">{recipe.estimatedPrepTime}</p>
                  </div>
                </div>
              )}
              {recipe.estimatedCookTime && (
                <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                  <Clock className="h-5 w-5 mr-2 text-accent shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Cook Time</p>
                    <p className="text-sm text-muted-foreground">{recipe.estimatedCookTime}</p>
                  </div>
                </div>
              )}
              {recipe.servingSize && (
                <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                  <Users className="h-5 w-5 mr-2 text-accent shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Servings</p>
                    <p className="text-sm text-muted-foreground">{recipe.servingSize}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Soup className="h-6 w-6 mr-2 text-primary shrink-0" />
                Instructions
              </h3>
              {processedInstructions.length > 0 ? (
                <div className="space-y-2 text-foreground/90">
                  {processedInstructions.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-7 text-right pr-2 shrink-0 tabular-nums pt-px">
                        {index + 1}.
                      </span>
                      <p className="flex-1 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No detailed instructions provided for this recipe.</p>
              )}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
