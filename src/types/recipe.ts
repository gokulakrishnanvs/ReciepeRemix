import type { GenerateRecipeOutput } from "@/ai/flows/generate-recipe";
import type { Timestamp } from "firebase/firestore";

export type Recipe = GenerateRecipeOutput;

export interface StoredRecipe extends Recipe {
  id?: string; // Firestore document ID
  userId: string;
  createdAt: Timestamp | Date; // Firestore Timestamp on save, Date on fetch
  ingredients: string[]; // Store the ingredients used
}
