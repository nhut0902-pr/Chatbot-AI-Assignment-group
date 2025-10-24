import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function getValue<T>(key: string, initialValue: T | (() => T)): T {
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null) {
        try {
            return JSON.parse(savedValue);
        } catch {
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
    }
    return initialValue instanceof Function ? initialValue() : initialValue;
}

// FIX: Imported Dispatch and SetStateAction and used them directly.
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => getValue(key, initialValue));

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Could not save to local storage:", error);
        }
    }, [key, value]);

    return [value, setValue];
}