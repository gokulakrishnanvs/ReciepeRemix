
"use client";

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // Initialize state with initialValue.
  // This ensures the first render is consistent on server and client, preventing hydration errors.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );
  
  // Effect to update state if localStorage changes in another tab/window
  useEffect(() => {
    if (typeof window === 'undefined') return; // Guard against server-side execution

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        if (event.newValue !== null) {
          try {
            setStoredValue(JSON.parse(event.newValue));
          } catch (error) {
            console.error(`Error parsing localStorage change for key "${key}":`, error);
          }
        } else {
          // Key was removed or set to null in another tab, reset to initialValue
          setStoredValue(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]); // initialValue dependency added for completeness if it can change


  // Effect to read from localStorage on client mount, after initial render.
  // This runs only on the client, after hydration is complete.
  useEffect(() => {
    if (typeof window === 'undefined') return; // Guard against server-side execution

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
      // If item is null, 'storedValue' correctly remains 'initialValue' from useState.
    } catch (error) {
      console.error(`Error reading localStorage key "${key}" on mount:`, error);
      // If error, 'storedValue' remains 'initialValue'.
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Only re-run if 'key' changes.

  return [storedValue, setValue];
}
