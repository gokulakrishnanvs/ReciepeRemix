// src/components/layout/header.tsx
"use client";

import { ChefHat, LogIn, LogOut, BookUser } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from '@/lib/firebase/config'; // Import auth directly
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Import necessary functions

export function AppHeader() {
  const { user, isLoggedIn, isLoading: authIsLoading } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async () => {
    console.log("Attempting to sign in with Google...");
    if (authIsLoading) {
      console.log("Auth is still loading. Aborting sign-in attempt.");
      toast({ title: "Please Wait", description: "Authentication is still initializing. Please try again shortly.", variant: "default" });
      return;
    }

    const provider = new GoogleAuthProvider();
    console.log("Firebase Auth instance:", auth);
    console.log("Google Auth Provider:", provider);

    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Sign-in successful. User:", result.user);
      toast({ title: "Signed In", description: `Welcome back, ${result.user.displayName || result.user.email}!` });
    } catch (error: any) {
      console.error("Sign-in error object:", error); 
      
      let toastTitle = "Sign In Failed";
      let toastDescription = "Could not sign in with Google. Please try again.";
      let toastVariant: "default" | "destructive" = "destructive";

      if (error.code) {
        console.error(`Firebase Auth Error Code: ${error.code}, Message: ${error.message}`);
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            toastTitle = "Sign-In Cancelled";
            toastDescription = "You closed the sign-in window before completing the process.";
            toastVariant = "default"; 
            break;
          case 'auth/popup-blocked':
            toastTitle = "Sign-In Failed";
            toastDescription = "Sign-in failed. The pop-up was blocked by your browser. Please disable pop-up blockers for this site and try again.";
            break;
          case 'auth/cancelled-popup-request':
            toastTitle = "Sign-In Cancelled";
            toastDescription = "Sign-in cancelled. Another sign-in pop-up might have been active or the request was interrupted. Please try again.";
            toastVariant = "default";
            break;
          case 'auth/operation-not-allowed':
            toastTitle = "Sign-In Failed";
            toastDescription = "Sign-in failed. Google Sign-In may not be enabled for this app in the Firebase console. Please contact support.";
            break;
          case 'auth/unauthorized-domain':
            toastTitle = "Sign-In Failed";
            toastDescription = "Sign-in failed. This domain is not authorized for OAuth operations for this Firebase project. Check your Firebase console's Auth settings and Google Cloud OAuth client authorized domains.";
            break;
          default:
            toastTitle = "Sign In Failed";
            toastDescription = `An unexpected error occurred during sign-in. (Code: ${error.code})`;
        }
      } else {
        console.error("A non-Firebase error occurred during sign-in:", error);
      }
      toast({ title: toastTitle, description: toastDescription, variant: toastVariant });
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut(); 
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
    } catch (error: any) {
      console.error("Sign out error", error);
      toast({ title: "Sign Out Failed", description: error.message || "Could not sign out. Please try again.", variant: "destructive" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <ChefHat className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl tracking-tight sm:inline-block">
            Recipe Remix
          </span>
        </Link>

        <div className="flex items-center space-x-3">
          {authIsLoading ? ( 
             <Button variant="ghost" size="icon" disabled className="h-9 w-9 rounded-full animate-pulse bg-muted"></Button>
          ) : isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                    <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/my-recipes" className="flex items-center cursor-pointer">
                    <BookUser className="mr-2 h-4 w-4" />
                    My Recipes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive-foreground focus:bg-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleSignIn} variant="outline" disabled={authIsLoading}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
