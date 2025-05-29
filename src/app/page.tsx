// src/app/page.tsx
"use client";

import { useState } from 'react';
import { generateRecipe, type GenerateRecipeInput } from '@/ai/flows/generate-recipe';
import type { Recipe } from '@/types/recipe';
import { IngredientForm } from '@/components/features/recipe-remix/ingredient-form';
import { RecipeCard } from '@/components/features/recipe-remix/recipe-card';
import { RecipeDetailDialog } from '@/components/features/recipe-remix/recipe-detail-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth'; // Import useAuth
import { saveRecipeForUser } from '@/app/actions/recipe-actions'; // Import server action
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, ChefHat } from "lucide-react";

export default function HomePage() {
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [currentIngredientsUsed, setCurrentIngredientsUsed] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipeForDialog, setSelectedRecipeForDialog] = useState<Recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, isLoggedIn } = useAuth(); // Get user and login state

  const handleGenerateRecipes = async (ingredients: string[]) => {
    if (ingredients.length === 0) {
      toast({
        title: "No Ingredients",
        description: "Please add some ingredients first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedRecipe(null);
    setCurrentIngredientsUsed(ingredients); // Store ingredients used for this generation

    const input: GenerateRecipeInput = {
      ingredients: ingredients.join(', '),
    };

    try {
      const recipeOutput = await generateRecipe(input);
      setGeneratedRecipe(recipeOutput);
      toast({
        title: "Recipe Generated!",
        description: `We found a recipe for ${recipeOutput.recipeName}.`,
      });

      // If user is logged in, save the recipe
      if (isLoggedIn && user?.uid) {
        const saveResult = await saveRecipeForUser(recipeOutput, ingredients, user.uid);
        if (saveResult.success) {
          toast({
            title: "Recipe Saved!",
            description: `${recipeOutput.recipeName} has been saved to your account.`,
            variant: "default",
          });
        } else {
          toast({
            title: "Save Failed",
            description: `Could not save ${recipeOutput.recipeName}. ${saveResult.error}`,
            variant: "destructive",
          });
        }
      }

    } catch (error) {
      console.error("Error generating recipe:", error);
      toast({
        title: "Error",
        description: "Failed to generate a recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRecipeDetails = (recipe: Recipe) => {
    setSelectedRecipeForDialog(recipe);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col items-center space-y-12">
      <IngredientForm onGenerateRecipes={handleGenerateRecipes} isLoading={isLoading} />

      {isLoading && (
        <div className="flex flex-col items-center space-y-4 p-8 rounded-lg bg-card shadow-lg">
          <ChefHat className="w-16 h-16 text-primary animate-bounce" />
          <p className="text-xl font-semibold text-foreground">Whipping up something special...</p>
          <p className="text-muted-foreground">Our AI chef is hard at work!</p>
           <div role="status" className="flex items-center justify-center mt-2">
            <svg aria-hidden="true" className="w-8 h-8 text-muted animate-spin dark:text-gray-600 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5424 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {generatedRecipe && !isLoading && (
        <div className="w-full max-w-2xl">
          <RecipeCard recipe={generatedRecipe} onViewDetails={handleViewRecipeDetails} />
        </div>
      )}
      
      {!generatedRecipe && !isLoading && (
         <Alert className="max-w-lg mx-auto shadow-md border-accent bg-accent/10">
          <Terminal className="h-5 w-5 text-accent" />
          <AlertTitle className="text-accent font-semibold">Ready to Cook?</AlertTitle>
          <AlertDescription className="text-accent/90">
            Add some ingredients using the form above and click "Generate Recipe" to get started!
          </AlertDescription>
        </Alert>
      )}

      <RecipeDetailDialog
        recipe={selectedRecipeForDialog}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
