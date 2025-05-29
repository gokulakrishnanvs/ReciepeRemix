"use client";

import { useState, type FormEvent } from 'react';
import { PlusCircle, Trash2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IngredientChip } from './ingredient-chip';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IngredientFormProps {
  onGenerateRecipes: (ingredients: string[]) => void;
  isLoading: boolean;
}

const MAX_INGREDIENTS_DISPLAY = 8; // Max ingredients to show before scroll area kicks in

export function IngredientForm({ onGenerateRecipes, isLoading }: IngredientFormProps) {
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [ingredients, setIngredients] = useLocalStorage<string[]>('recipe-remix-ingredients', []);

  const handleAddIngredient = (e?: FormEvent) => {
    e?.preventDefault();
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim().toLowerCase())) {
      setIngredients([...ingredients, currentIngredient.trim().toLowerCase()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
  };

  const handleClearIngredients = () => {
    setIngredients([]);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Your Ingredients</CardTitle>
        <CardDescription>Add what you have, and we'll find a recipe!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAddIngredient} className="flex items-center gap-2">
          <Input
            type="text"
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            placeholder="e.g., chicken breast, tomatoes"
            className="flex-grow"
            aria-label="Add ingredient"
          />
          <Button type="submit" size="icon" aria-label="Add ingredient">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </form>
        
        {ingredients.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Available Ingredients:</h3>
            <ScrollArea className={ingredients.length > MAX_INGREDIENTS_DISPLAY ? 'h-40' : ''}>
              <div className="flex flex-wrap gap-2 p-1">
                {ingredients.map((ing) => (
                  <IngredientChip key={ing} ingredient={ing} onRemove={handleRemoveIngredient} />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
        <Button
          variant="outline"
          onClick={handleClearIngredients}
          disabled={ingredients.length === 0 || isLoading}
          className="w-full sm:w-auto"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
        <Button
          onClick={() => onGenerateRecipes(ingredients)}
          disabled={ingredients.length === 0 || isLoading}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? (
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}
