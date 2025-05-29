// src/components/features/recipe-remix/ingredient-form.tsx
"use client";

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { PlusCircle, Trash2, Sparkles, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IngredientChip } from './ingredient-chip';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface IngredientFormProps {
  onGenerateRecipes: (ingredients: string[]) => void;
  isLoading: boolean;
}

const MAX_INGREDIENTS_DISPLAY = 8;

const BASIC_INGREDIENTS = [
  "olive oil", "salt", "black pepper", "garlic", "onion", 
  "tomatoes", "flour", "sugar", "eggs", "butter", "milk", "rice", "pasta", "chicken breast", "lemon"
];

export function IngredientForm({ onGenerateRecipes, isLoading }: IngredientFormProps) {
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [ingredients, setIngredients] = useLocalStorage<string[]>('recipe-remix-ingredients', []);

  const handleAddIngredient = (ingredientValue: string, e?: FormEvent) => {
    e?.preventDefault();
    const trimmedIngredient = ingredientValue.trim().toLowerCase();
    if (trimmedIngredient && !ingredients.includes(trimmedIngredient)) {
      setIngredients(prevIngredients => [...prevIngredients, trimmedIngredient].sort());
    }
    if (e) { // Only clear input if it was a form submission
        setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
  };

  const handleClearIngredients = () => {
    setIngredients([]);
  };
  
  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">What's in Your Kitchen?</CardTitle>
        <CardDescription>Add your ingredients below, or pick from our suggestions. Then, let AI whip up a recipe!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={(e) => handleAddIngredient(currentIngredient, e)} className="flex items-center gap-3">
          <Input
            type="text"
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            placeholder="e.g., chicken, broccoli, soy sauce"
            className="flex-grow text-base py-3"
            aria-label="Add ingredient"
          />
          <Button type="submit" size="lg" aria-label="Add ingredient" className="px-4">
            <PlusCircle className="h-5 w-5" />
            <span className="ml-2 hidden sm:inline">Add</span>
          </Button>
        </form>
        
        <Separator />

        <div>
            <h3 className="text-md font-semibold text-foreground mb-3">Quick Add Common Ingredients:</h3>
            <div className="flex flex-wrap gap-2">
                {BASIC_INGREDIENTS.filter(basicIng => !ingredients.includes(basicIng.toLowerCase())).slice(0,10).map((basicIng) => (
                    <Button 
                        key={basicIng} 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddIngredient(basicIng)}
                        className="group transition-all duration-150 ease-in-out hover:shadow-md"
                        aria-label={`Add ${basicIng}`}
                    >
                       <Image
                            src={`https://placehold.co/20x20.png?text=${basicIng.charAt(0).toUpperCase()}`}
                            alt={basicIng}
                            width={20}
                            height={20}
                            className="rounded-sm mr-2 group-hover:scale-110 transition-transform"
                            data-ai-hint={`${slugify(basicIng)} food ingredient`}
                        />
                        <span className="capitalize">{basicIng}</span>
                        <PlusCircle className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </Button>
                ))}
            </div>
        </div>

        {ingredients.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-primary">Your Selected Ingredients:</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearIngredients}
                    disabled={ingredients.length === 0 || isLoading}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                    >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Clear All
                </Button>
            </div>
            <ScrollArea className={cn("transition-all duration-300 ease-in-out", ingredients.length > MAX_INGREDIENTS_DISPLAY ? 'h-48' : 'h-auto')}>
              <div className="flex flex-wrap gap-3 p-1">
                {ingredients.map((ing) => (
                  <IngredientChip key={ing} ingredient={ing} onRemove={handleRemoveIngredient} />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 p-6 border-t">
        <Button
          onClick={() => onGenerateRecipes(ingredients)}
          disabled={ingredients.length === 0 || isLoading}
          className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105"
          size="lg"
        >
          {isLoading ? (
            <>
              <Sparkles className="mr-2 h-5 w-5 animate-spin" />
              Crafting Your Recipe...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Recipe ({ingredients.length} {ingredients.length === 1 ? 'item' : 'items'})
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
