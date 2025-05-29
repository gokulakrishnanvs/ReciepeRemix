// src/app/my-recipes/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { StoredRecipe } from '@/types/recipe';
import { getUserRecipesAction } from '@/app/actions/recipe-actions';
import { RecipeCard } from '@/components/features/recipe-remix/recipe-card';
import { RecipeDetailDialog } from '@/components/features/recipe-remix/recipe-detail-dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, AlertTriangle, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MyRecipesPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<StoredRecipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipeForDialog, setSelectedRecipeForDialog] = useState<StoredRecipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user) {
      setIsLoadingRecipes(true);
      getUserRecipesAction(user.uid)
        .then(userRecipes => {
          setRecipes(userRecipes);
          setError(null);
        })
        .catch(err => {
          console.error("Failed to fetch recipes:", err);
          setError("Could not load your recipes. Please try again later.");
          setRecipes([]);
        })
        .finally(() => {
          setIsLoadingRecipes(false);
        });
    } else if (!authLoading && !isLoggedIn) {
      // If auth is done loading and user is not logged in, no need to fetch
      setIsLoadingRecipes(false);
      setRecipes([]);
    }
  }, [user, isLoggedIn, authLoading]);

  const handleViewRecipeDetails = (recipe: StoredRecipe) => {
    setSelectedRecipeForDialog(recipe);
    setIsDialogOpen(true);
  };

  if (authLoading || (isLoggedIn && isLoadingRecipes)) {
    return (
      <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your recipes...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto py-12 px-4 text-center min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">Please sign in to view your saved recipes.</p>
        {/* The sign-in button is in the header, so no need for one here unless desired */}
        <Button asChild>
          <Link href="/">Discover Recipes</Link>
        </Button>
      </div>
    );
  }
  
  if (error) {
     return (
      <div className="container mx-auto py-12 px-4 text-center min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Error Loading Recipes</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
         <Button asChild className="mt-6">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Saved Recipes</h1>
        <Button asChild variant="outline">
            <Link href="/">
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate New Recipe
            </Link>
        </Button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-muted-foreground/30 rounded-lg">
          <ChefHat className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">No Recipes Yet!</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't saved any recipes. <br/>Generate some delicious meals to see them here.</p>
          <Button asChild>
            <Link href="/">Start Cooking</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id || recipe.recipeName} recipe={recipe} onViewDetails={() => handleViewRecipeDetails(recipe)} />
          ))}
        </div>
      )}

      <RecipeDetailDialog
        recipe={selectedRecipeForDialog}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
