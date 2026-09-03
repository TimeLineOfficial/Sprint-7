import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values (e.g. username API availability checks).
 * @param {any} value - The input value to debounce.
 * @param {number} delay - Minimum delay in milliseconds (default: 500ms).
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
