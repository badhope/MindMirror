const DB_NAME = 'mindmirror-cache'
const DB_VERSION = 1

interface CacheEntry {
  id: string
  data: any
  timestamp: number
  ttl?: number
}

class LocalCache {
  private dbPromise: Promise<IDBDatabase> | null = null

  constructor() {
    this.initDB()
  }

  private async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains('assessments')) {
          db.createObjectStore('assessments', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('results')) {
          db.createObjectStore('results', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('moods')) {
          db.createObjectStore('moods', { keyPath: 'id' })
        }
      }
    })
  }

  private async getDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = this.initDB()
    }
    return this.dbPromise
  }

  async get(storeName: string, id: string): Promise<any | null> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(id)

      request.onsuccess = () => {
        const entry = request.result as CacheEntry | undefined
        if (entry) {
          if (entry.ttl && Date.now() > entry.timestamp + entry.ttl) {
            this.delete(storeName, id)
            resolve(null)
          } else {
            resolve(entry.data)
          }
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  async set(storeName: string, id: string, data: any, ttl?: number): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const entry: CacheEntry = {
        id,
        data,
        timestamp: Date.now(),
        ttl,
      }
      const request = store.put(entry)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async delete(storeName: string, id: string): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getAll(storeName: string): Promise<any[]> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        const entries = request.result as CacheEntry[]
        resolve(entries.map(e => e.data))
      }
      request.onerror = () => reject(request.error)
    })
  }
}

export const localCache = new LocalCache()
