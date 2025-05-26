// File storage service for handling uploads, downloads, and management
import { v4 as uuidv4 } from 'uuid';

// Define file metadata types
export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  lastModified: string;
  userId: string;
  description?: string;
  tags?: string[];
  category?: 'dataset' | 'model' | 'image' | 'document' | 'other';
  url?: string;
}

export interface UploadOptions {
  description?: string;
  tags?: string[];
  category?: 'dataset' | 'model' | 'image' | 'document' | 'other';
  onProgress?: (progress: number) => void;
}

// In a real implementation, this would interact with S3, Azure Blob Storage, etc.
// For now, we'll simulate file storage with localStorage and IndexedDB
class FileStorageService {
  private readonly METADATA_KEY = 'alpha_file_metadata';
  private db: IDBDatabase | null = null;
  private isBrowserEnv: boolean;
  
  constructor() {
    // Check if we're in a browser environment
    this.isBrowserEnv = typeof window !== 'undefined' && 
                        typeof window.indexedDB !== 'undefined';
    
    if (this.isBrowserEnv) {
      this.initializeIndexedDB();
    }
  }
  
  // Initialize IndexedDB for file content storage
  private initializeIndexedDB(): void {
    if (!this.isBrowserEnv) return;
    
    const request = window.indexedDB.open('AlphaFileStorage', 1);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };
    
    request.onerror = (event) => {
      console.error('IndexedDB initialization error:', event);
    };
  }
  
  // Get all file metadata
  public async getAllFiles(): Promise<FileMetadata[]> {
    if (!this.isBrowserEnv) return [];
    
    const metadataString = localStorage.getItem(this.METADATA_KEY);
    return metadataString ? JSON.parse(metadataString) : [];
  }
  
  // Get file metadata by id
  public async getFileById(id: string): Promise<FileMetadata | null> {
    if (!this.isBrowserEnv) return null;
    
    const files = await this.getAllFiles();
    return files.find(file => file.id === id) || null;
  }
  
  // Upload a file
  public async uploadFile(file: File, options?: UploadOptions): Promise<FileMetadata> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.isBrowserEnv) {
          reject(new Error('Browser storage not available'));
          return;
        }
        
        if (!this.db) {
          reject(new Error('IndexedDB not initialized'));
          return;
        }
        
        const fileId = uuidv4();
        const fileMetadata: FileMetadata = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          lastModified: new Date(file.lastModified).toISOString(),
          userId: 'current-user', // In a real app, this would come from auth
          description: options?.description,
          tags: options?.tags,
          category: options?.category || 'other',
        };
        
        // Read the file
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        
        reader.onload = async (e) => {
          // Store file content in IndexedDB
          const transaction = this.db!.transaction(['files'], 'readwrite');
          const store = transaction.objectStore('files');
          
          // Store the file data
          const fileData = {
            id: fileId,
            content: e.target!.result,
          };
          
          const storeRequest = store.add(fileData);
          
          storeRequest.onsuccess = async () => {
            // Store metadata in localStorage
            const files = await this.getAllFiles();
            files.push(fileMetadata);
            localStorage.setItem(this.METADATA_KEY, JSON.stringify(files));
            
            resolve(fileMetadata);
          };
          
          storeRequest.onerror = (event) => {
            reject(new Error('Error storing file data'));
          };
        };
        
        reader.onerror = (event) => {
          reject(new Error('Error reading file'));
        };
        
        if (options?.onProgress) {
          // Simulate progress for demo purposes
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            options.onProgress!(progress);
            if (progress >= 100) {
              clearInterval(interval);
            }
          }, 200);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Download a file
  public async downloadFile(id: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.isBrowserEnv) {
          reject(new Error('Browser storage not available'));
          return;
        }
        
        if (!this.db) {
          reject(new Error('IndexedDB not initialized'));
          return;
        }
        
        const transaction = this.db.transaction(['files'], 'readonly');
        const store = transaction.objectStore('files');
        const request = store.get(id);
        
        request.onsuccess = async (event) => {
          const fileData = (event.target as IDBRequest).result;
          if (!fileData) {
            reject(new Error('File not found'));
            return;
          }
          
          const metadata = await this.getFileById(id);
          if (!metadata) {
            reject(new Error('File metadata not found'));
            return;
          }
          
          const blob = new Blob([fileData.content], { type: metadata.type });
          resolve(blob);
        };
        
        request.onerror = (event) => {
          reject(new Error('Error retrieving file'));
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Delete a file
  public async deleteFile(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.isBrowserEnv) {
          reject(new Error('Browser storage not available'));
          return;
        }
        
        if (!this.db) {
          reject(new Error('IndexedDB not initialized'));
          return;
        }
        
        // Delete from IndexedDB
        const transaction = this.db.transaction(['files'], 'readwrite');
        const store = transaction.objectStore('files');
        const request = store.delete(id);
        
        request.onsuccess = async () => {
          // Update metadata in localStorage
          const files = await this.getAllFiles();
          const updatedFiles = files.filter(file => file.id !== id);
          localStorage.setItem(this.METADATA_KEY, JSON.stringify(updatedFiles));
          
          resolve(true);
        };
        
        request.onerror = (event) => {
          reject(new Error('Error deleting file'));
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Update file metadata
  public async updateFileMetadata(id: string, updates: Partial<FileMetadata>): Promise<FileMetadata | null> {
    try {
      if (!this.isBrowserEnv) return null;
      
      const files = await this.getAllFiles();
      const fileIndex = files.findIndex(file => file.id === id);
      
      if (fileIndex === -1) {
        return null;
      }
      
      // Update metadata
      const updatedFile = {
        ...files[fileIndex],
        ...updates,
        lastModified: new Date().toISOString(),
      };
      
      files[fileIndex] = updatedFile;
      localStorage.setItem(this.METADATA_KEY, JSON.stringify(files));
      
      return updatedFile;
    } catch (error) {
      console.error('Error updating file metadata:', error);
      return null;
    }
  }
  
  // Search files by name, tags, or description
  public async searchFiles(query: string): Promise<FileMetadata[]> {
    try {
      if (!this.isBrowserEnv) return [];
      
      const files = await this.getAllFiles();
      
      if (!query.trim()) {
        return files;
      }
      
      const lowerQuery = query.toLowerCase();
      return files.filter(file => 
        file.name.toLowerCase().includes(lowerQuery) ||
        file.description?.toLowerCase().includes(lowerQuery) ||
        file.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error searching files:', error);
      return [];
    }
  }
  
  // Get files by category
  public async getFilesByCategory(category: string): Promise<FileMetadata[]> {
    try {
      if (!this.isBrowserEnv) return [];
      
      const files = await this.getAllFiles();
      return files.filter(file => file.category === category);
    } catch (error) {
      console.error('Error getting files by category:', error);
      return [];
    }
  }
  
  // Generate a download URL for a file (in a real app, this would be a signed URL)
  public async getDownloadUrl(id: string): Promise<string> {
    try {
      if (!this.isBrowserEnv) {
        throw new Error('Browser storage not available');
      }
      
      const blob = await this.downloadFile(id);
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error generating download URL:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const fileStorageService = new FileStorageService();

export default fileStorageService;
