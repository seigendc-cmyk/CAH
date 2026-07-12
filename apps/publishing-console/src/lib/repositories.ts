import type { Book, Author, Publisher, Category } from '@eot/shared-types';

export interface IRepository<T extends { id: string }> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface IBookRepository extends IRepository<Book> {
  // Additional book specific queries if needed
}

// Local Storage Implementations
function getStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

class LocalStorageRepository<T extends { id: string }> implements IRepository<T> {
  private storageKey: string;
  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  async getAll(): Promise<T[]> {
    return getStorage<T>(this.storageKey);
  }

  async getById(id: string): Promise<T | undefined> {
    const items = getStorage<T>(this.storageKey);
    return items.find((item) => item.id === id);
  }

  async save(entity: T): Promise<void> {
    const items = getStorage<T>(this.storageKey);
    const index = items.findIndex((item) => item.id === entity.id);
    if (index >= 0) {
      items[index] = entity;
    } else {
      items.push(entity);
    }
    setStorage(this.storageKey, items);
  }

  async delete(id: string): Promise<void> {
    let items = getStorage<T>(this.storageKey);
    items = items.filter((item) => item.id !== id);
    setStorage(this.storageKey, items);
  }
}

export const bookRepository: IBookRepository = new LocalStorageRepository<Book>('eot_books');
export const authorRepository: IRepository<Author> = new LocalStorageRepository<Author>('eot_authors');
export const publisherRepository: IRepository<Publisher> = new LocalStorageRepository<Publisher>('eot_publishers');
export const categoryRepository: IRepository<Category> = new LocalStorageRepository<Category>('eot_categories');

import type { Character, Asset } from '@eot/shared-types';
export const characterRepository: IRepository<Character> = new LocalStorageRepository<Character>('eot_characters');
export const assetRepository: IRepository<Asset> = new LocalStorageRepository<Asset>('eot_assets');
