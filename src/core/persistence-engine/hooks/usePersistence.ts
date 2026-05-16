import { useState, useEffect, useCallback } from 'react';
import { PersistedSnapshot } from '../types';
import { serializeDecimalSafe, hydrateDecimalSafe } from '../serializers/decimalSerializer';
import { SyncQueue } from '../queue/syncQueue';

export interface UsePersistenceConfig {
  calculatorId: string;
  schemaVersion: number;
  migrators?: Array<(data: any) => any>; // Sequential pipeline to upgrade legacy schemas
}

export function usePersistenceEngine<T>(config: UsePersistenceConfig, queue?: SyncQueue) {
  const { calculatorId, schemaVersion, migrators = [] } = config;
  const storageKey = `CalculatorsPoint_history_${calculatorId}`;
  
  const [history, setHistory] = useState<PersistedSnapshot<T>[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsedData: PersistedSnapshot<any>[] = hydrateDecimalSafe(raw);
        
        // Apply Migration Strategies automatically upon hydration
        const migratedData = parsedData.map(snap => {
          let currentData = snap.data;
          let currentVersion = snap.schemaVersion;
          
          while (currentVersion < schemaVersion && migrators[currentVersion - 1]) {
            currentData = migrators[currentVersion - 1](currentData);
            currentVersion++;
          }
          
          return { ...snap, data: currentData, schemaVersion: currentVersion };
        });

        setHistory(migratedData);
      } catch (e) {
        console.error(`Failed to hydrate persistence history for ${calculatorId}`, e);
      }
    }
  }, [storageKey, schemaVersion, migrators, calculatorId]);

  const saveSnapshot = useCallback((data: T) => {
    const snapshot: PersistedSnapshot<T> = {
      snapshotId: crypto.randomUUID(),
      calculatorId,
      schemaVersion,
      timestamp: Date.now(),
      data
    };

    setHistory(prev => {
      const updated = [snapshot, ...prev].slice(0, 50); // Hard cap to prevent IndexedDB/LocalStorage memory leaks
      const serialized = serializeDecimalSafe(updated);
      localStorage.setItem(storageKey, serialized);
      
      if (queue) {
        queue.enqueue({
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          action: 'UPSERT',
          key: `snapshot_${snapshot.snapshotId}`,
          payload: serializeDecimalSafe(snapshot),
          version: 1
        });
      }
      return updated;
    });
  }, [calculatorId, schemaVersion, storageKey, queue]);

  const removeSnapshot = useCallback((snapshotId: string) => {
    setHistory(prev => {
      const updated = prev.filter(s => s.snapshotId !== snapshotId);
      localStorage.setItem(storageKey, serializeDecimalSafe(updated));
      
      if (queue) {
        queue.enqueue({
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          action: 'DELETE',
          key: `snapshot_${snapshotId}`,
          version: 1
        });
      }
      return updated;
    });
  }, [storageKey, queue]);

  return {
    history,
    saveSnapshot,
    removeSnapshot
  };
}

