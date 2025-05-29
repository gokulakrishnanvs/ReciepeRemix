// src/ai/flows/improve-recipe.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for improving an existing recipe based on user feedback.
 *
 * - improveRecipe - An exported function that takes a recipe and improvement suggestions as input and returns an improved recipe.
 * - ImproveRecipeInput - The input type for the improveRecipe function, including the original recipe and improvement suggestions.
 * - ImproveRecipeOutput - The output type for the improveRecipe function, representing the improved recipe.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveRecipeInputSchema = z.object({
  recipe: z.string().describe('The original recipe to be improved.'),
  improvementSuggestions: z
    .string()
    .describe('Suggestions for improving the recipe.'),
});
export type ImproveRecipeInput = z.infer<typeof ImproveRecipeInputSchema>;

const ImproveRecipeOutputSchema = z.object({
  improvedRecipe: z.string().describe('The improved recipe based on the suggestions.'),
});
export type ImproveRecipeOutput = z.infer<typeof ImproveRecipeOutputSchema>;

export async function improveRecipe(input: ImproveRecipeInput): Promise<ImproveRecipeOutput> {
  return improveRecipeFlow(input);
}

const improveRecipePrompt = ai.definePrompt({
  name: 'improveRecipePrompt',
  input: {schema: ImproveRecipeInputSchema},
  output: {schema: ImproveRecipeOutputSchema},
  prompt: `You are a recipe improvement expert. Given the original recipe and the user's suggestions, create an improved version of the recipe.

Original Recipe: {{{recipe}}}

Improvement Suggestions: {{{improvementSuggestions}}}

Improved Recipe:`, 
});

const improveRecipeFlow = ai.defineFlow(
  {
    name: 'improveRecipeFlow',
    inputSchema: ImproveRecipeInputSchema,
    outputSchema: ImproveRecipeOutputSchema,
  },
  async input => {
    const {output} = await improveRecipePrompt(input);
    return output!;
  }
);
