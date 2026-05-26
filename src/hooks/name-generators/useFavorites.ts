'use client';
import { useState, useEffect, useCallback } from 'react';

export interface FavoriteItem {
  id: string;
  name: string;
  meaning?: string;
  tagline?: string;
  toolId: string;
  toolName: string;
  savedAt: number;
}

const STORAGE_KEY = 'ng-favorites-v1';

export function useFavorites(toolId: string) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const all: FavoriteItem[] = JSON.parse(stored);
        setFavorites(all.filter(f => f.toolId === toolId));
      }
    } catch {
      // ignore
    }
  }, [toolId]);

  const getAllFavorites = useCallback((): FavoriteItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  }, []);

  const saveAll = useCallback((all: FavoriteItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch { /* ignore */ }
  }, []);

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'id' | 'toolId' | 'savedAt'>) => {
    const newItem: FavoriteItem = {
      ...item,
      id: `${toolId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      toolId,
      savedAt: Date.now(),
    };
    const all = getAllFavorites();
    const updated = [...all, newItem];
    saveAll(updated);
    setFavorites(prev => [...prev, newItem]);
    return newItem;
  }, [toolId, getAllFavorites, saveAll]);

  const removeFavorite = useCallback((id: string) => {
    const all = getAllFavorites();
    const updated = all.filter(f => f.id !== id);
    saveAll(updated);
    setFavorites(prev => prev.filter(f => f.id !== id));
  }, [getAllFavorites, saveAll]);

  const isFavorite = useCallback((name: string): boolean => {
    return favorites.some(f => f.name === name);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    const all = getAllFavorites();
    const updated = all.filter(f => f.toolId !== toolId);
    saveAll(updated);
    setFavorites([]);
  }, [toolId, getAllFavorites, saveAll]);

  const exportCSV = useCallback(() => {
    if (favorites.length === 0) return;
    const header = 'Name,Meaning,Tagline,Tool,Saved At';
    const rows = favorites.map(f =>
      `"${f.name}","${f.meaning || ''}","${f.tagline || ''}","${f.toolName}","${new Date(f.savedAt).toLocaleDateString()}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${toolId}-favorites.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [favorites, toolId]);

  return { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites, exportCSV };
}
