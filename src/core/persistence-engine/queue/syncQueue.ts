import { MutationRecord, PersistenceDriver } from '../types';

export class SyncQueue {
  private queue: MutationRecord[] = [];
  private isProcessing = false;
  private driver: PersistenceDriver;
  private queueKey = '__CalculatorsPoint_offline_queue__';

  constructor(driver: PersistenceDriver) {
    this.driver = driver;
    this.loadOfflineQueue();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.processQueue());
    }
  }

  private loadOfflineQueue() {
    if (typeof localStorage === 'undefined') return;
    const saved = localStorage.getItem(this.queueKey);
    if (saved) {
      try {
        this.queue = JSON.parse(saved);
      } catch {
        this.queue = [];
      }
    }
  }

  private saveOfflineQueue() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.queueKey, JSON.stringify(this.queue));
    }
  }

  public enqueue(mutation: MutationRecord) {
    // Deduplication strategy: overwrite pending UPSERTs for the same key to reduce payload size
    const existingIndex = this.queue.findIndex(m => m.key === mutation.key && m.action === 'UPSERT');
    if (existingIndex > -1 && mutation.action === 'UPSERT') {
      this.queue[existingIndex] = mutation;
    } else {
      this.queue.push(mutation);
    }
    
    this.saveOfflineQueue();
    this.processQueue();
  }

  public async processQueue() {
    if (this.isProcessing || this.queue.length === 0 || !navigator.onLine) return;
    
    this.isProcessing = true;
    try {
      const result = await this.driver.sync(this.queue);
      if (result.success) {
        this.queue = [];
        this.saveOfflineQueue();
      } else {
        console.warn("Sync Driver reported failure, retaining queue for next network attempt.");
      }
    } catch (error) {
      console.error("Sync layer crashed. Mutations safely held in offline queue.", error);
    } finally {
      this.isProcessing = false;
    }
  }
}

