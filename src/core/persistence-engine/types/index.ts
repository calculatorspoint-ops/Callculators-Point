export interface SyncResult {
  success: boolean;
  errors?: string[];
}

export interface PersistenceDriver {
  save(key: string, data: string): Promise<void>;
  load(key: string): Promise<string | null>;
  remove(key: string): Promise<void>;
  sync(mutations: MutationRecord[]): Promise<SyncResult>;
}

export interface MutationRecord {
  id: string;
  timestamp: number;
  action: 'UPSERT' | 'DELETE';
  key: string;
  payload?: string;
  version: number;
}

export interface PersistedSnapshot<T> {
  snapshotId: string;
  calculatorId: string;
  schemaVersion: number;
  timestamp: number;
  data: T;
}
