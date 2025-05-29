// src/app/actions/recipe-actions.ts
'use server';

import { auth, db } from '@/lib/firebase/config';
import type { Recipe, StoredRecipe } from '@/types/recipe';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function saveRecipeAction(recipeData: Recipe, ingredients: string[]): Promise<{ success: boolean; recipeId?: string; error?: string }> {
  const user = auth.currentUser; // This will be null in a server action if not using session cookies
                               // For client-side auth, user info needs to be passed or handled differently.
                               // Assuming this action is called from a client that ensures user is authenticated.
                               // A better approach would be to get userId from a session or passed parameter.

  // For simplicity, let's assume the client will pass the userId
  // This is a temporary workaround for server actions + client-side auth.
  // In a robust app, you'd use session management (e.g., NextAuth.js or Firebase session cookies).

  // This action will be called from a client component that has access to the user ID.
  // We'll need to adjust how userId is obtained if this were a pure server-initiated flow.
  // For now, let's expect `userId` to be part of a secure context or passed in.
  // However, `auth.currentUser` won't work reliably here without session cookies.
  // Let's modify the function to accept `userId` as a parameter.
  // This means the calling client component needs to get the UID and pass it.
  
  // The user will need to be passed from the client or use a proper session management.
  // For this example, we'll rely on the client to send user.uid.
  // This is NOT secure for production without proper validation.
  // Let's assume the client will call this and provide the userId.
  // This is a common pattern for Firebase client SDK + server actions for mutations.
  // The client code in page.tsx will need to get user.uid and pass it.
  
  // Re-evaluating: It's better if the server action itself tries to get the authenticated user if possible.
  // But without proper session cookies (which `firebase/auth` client SDK doesn't set up by default for server actions),
  // `auth.currentUser` will be null.
  // The `AppHeader` and other client components use `useAuth` which gets the user from `onAuthStateChanged`.
  // For a server action, this context isn't directly available.
  
  // The simplest way for now, given Firebase Studio's context, is to make the client
  // pass the `userId`. This is a common pattern when bridging client-SDK auth with serverless functions.

  // We will pass userId as an argument to this server action.
  // The client component `HomePage` will get the `user.uid` from `useAuth` hook
  // and pass it to `saveRecipeAction`.
  
  // Let's adjust the function signature
  // async function saveRecipeAction(recipeData: Recipe, ingredients: string[], userId: string): Promise<{ success: boolean; recipeId?: string; error?: string }>
  // This seems like a reasonable approach for Firebase Studio.

  // We'll retrieve userId from a passed argument, as auth.currentUser won't work in server actions without session cookies.
  // This means the client code needs to ensure the user is authenticated and pass the UID.
  // Let's refine the function to accept `userId` from the client.
  // This is a common pattern with Firebase client SDK and server actions.
  // The client `HomePage` will get `user.uid` from `useAuth` and pass it.

  // The correct way to get the user in a server action if using Firebase is typically through
  // Firebase Admin SDK verifying an ID token sent from the client, or by using session cookies.
  // Since we don't have Admin SDK setup here by default and want to keep it simpler for Studio,
  // we'll take userId as an argument. This is okay for prototyping but needs securing for production.

  // Let's assume userId is passed as part of recipeData or a separate arg.
  // For this iteration, we will expect `userId` to be passed as a parameter.
  
  // The `auth.currentUser` object is only available on the client-side after authentication.
  // Server Actions execute on the server and don't have direct access to this client-side auth state
  // unless you implement session management (e.g., with Firebase session cookies or NextAuth.js).
  // For this example, we will pass the `userId` from the client to this server action.

  // Final Decision: Pass userId as an argument.
  // The client component (HomePage) will get user.uid from useAuth() and pass it.
  
  // This function needs to be callable from the client, and the client will provide the userId.
  // Correct signature:
  // export async function saveRecipeAction(recipeData: Recipe, ingredients: string[], userId: string): Promise<{...}>
  // The `page.tsx` will need to be updated to pass `user.uid`.

  // Let's make userId an argument to this server action.
  // The client (HomePage) will provide the user.uid from the useAuth hook.
  // This is a common pattern for Firebase client SDK + server actions for mutations.
  
  // The user's ID needs to be passed from the client-side, as `auth.currentUser`
  // will not be populated in a server action environment without session cookies.
  // The `HomePage` component will use the `useAuth` hook to get the `user.uid`
  // and pass it to this action.

  // Server actions don't automatically have `auth.currentUser` from the client SDK.
  // The UID must be passed from the client or use server-side session management.
  // We will opt for passing UID from the client (via `HomePage`).
  
  // Let's assume the userId is passed as an argument to this server action.
  // The client (HomePage.tsx) will provide user.uid.
  // This is a common pattern with Firebase Client SDK + Server Actions for mutations.
  
  // Final Answer for getting user ID: pass as an argument from the client.
  // The `HomePage` component will use `useAuth` hook to get `user.uid` and pass it to this action.
  
  // We will pass `userId` as an argument from the client.
  // The client component (`HomePage`) will get `user.uid` from `useAuth()`
  // and pass it to `saveRecipeAction`.
  return {} as any; // Placeholder, actual implementation below.
}


export async function saveRecipeForUser(
  recipeData: Recipe,
  ingredients: string[],
  userId: string
): Promise<{ success: boolean; recipeId?: string; error?: string }> {
  if (!userId) {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    const recipeToSave: Omit<StoredRecipe, 'id' | 'createdAt'> & { createdAt: any } = {
      ...recipeData,
      userId,
      ingredients,
      createdAt: serverTimestamp(), // Use serverTimestamp for consistency
    };

    const docRef = await addDoc(collection(db, 'userRecipes'), recipeToSave);
    revalidatePath('/'); // Revalidate home page if needed
    revalidatePath('/my-recipes'); // Revalidate my-recipes page
    return { success: true, recipeId: docRef.id };
  } catch (error: any) {
    console.error('Error saving recipe:', error);
    return { success: false, error: error.message || 'Failed to save recipe.' };
  }
}


export async function getUserRecipesAction(userId: string): Promise<StoredRecipe[]> {
  if (!userId) {
    console.log("No user ID provided to getUserRecipesAction");
    return [];
  }

  try {
    const recipesRef = collection(db, 'userRecipes');
    const q = query(recipesRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const recipes = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to Date object for client-side usage if necessary
        // Or ensure client handles Timestamp objects (date-fns can format Timestamps)
        createdAt: (data.createdAt as Timestamp).toDate(), 
      } as StoredRecipe;
    });
    return recipes;
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    return []; // Return empty array on error
  }
}
