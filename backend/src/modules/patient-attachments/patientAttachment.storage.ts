// Patient Files & Attachments Physical Storage Driver Engine — Module-016

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import type { StorageProviderType } from './patientAttachment.types'

export interface IStorageDriver {
  saveFile(tenantId: string, patientId: string, fileName: string, buffer: Buffer): Promise<{ storagePath: string; checksum: string }>
  readFileStream(storagePath: string): fs.ReadStream
  deleteFile(storagePath: string): Promise<boolean>
  calculateChecksum(buffer: Buffer): string
}

export class LocalStorageDriver implements IStorageDriver {
  private baseStorageDir: string

  constructor(baseDir?: string) {
    this.baseStorageDir = baseDir || path.join(process.cwd(), 'storage', 'attachments')
  }

  calculateChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex')
  }

  async saveFile(tenantId: string, patientId: string, fileName: string, buffer: Buffer): Promise<{ storagePath: string; checksum: string }> {
    const targetDir = path.join(this.baseStorageDir, tenantId, patientId)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    const safeFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const fullPath = path.join(targetDir, safeFileName)

    await fs.promises.writeFile(fullPath, buffer)
    const checksum = this.calculateChecksum(buffer)

    return {
      storagePath: fullPath,
      checksum,
    }
  }

  readFileStream(storagePath: string): fs.ReadStream {
    if (!fs.existsSync(storagePath)) {
      throw new Error(`STORAGE_FILE_NOT_FOUND: File does not exist at path ${storagePath}`)
    }
    return fs.createReadStream(storagePath)
  }

  async deleteFile(storagePath: string): Promise<boolean> {
    try {
      if (fs.existsSync(storagePath)) {
        await fs.promises.unlink(storagePath)
      }
      return true
    } catch (err) {
      console.error(`Failed to delete physical storage file: ${storagePath}`, err)
      return false
    }
  }
}

export class NasStorageDriver extends LocalStorageDriver {
  constructor() {
    super(path.join(process.cwd(), 'storage', 'nas_attachments'))
  }
}

class StorageDriverFactory {
  private localDriver = new LocalStorageDriver()
  private nasDriver = new NasStorageDriver()

  getDriver(provider: StorageProviderType = 'LOCAL'): IStorageDriver {
    if (provider === 'NAS') return this.nasDriver
    // Reserved extension points for S3, Azure Blob, GCS
    return this.localDriver
  }
}

export const storageDriverFactory = new StorageDriverFactory()
