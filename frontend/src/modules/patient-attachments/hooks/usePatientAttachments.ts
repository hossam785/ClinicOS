// Patient Files & Attachments React Custom Hook — Module-016

import { useState, useEffect, useCallback } from 'react'
import type {
  IPatientAttachment,
  IAttachmentVersion,
  IAttachmentCategory,
  IAttachmentTag,
  IAttachmentAnalytics,
  IUploadAttachmentDto,
  IUpdateAttachmentDto,
  IAttachmentFilterOptions,
} from '../types/attachment.types'
import { patientAttachmentApi } from '../services/patientAttachmentApi'

export function usePatientAttachments(patientId: string) {
  const [attachments, setAttachments] = useState<IPatientAttachment[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [categories, setCategories] = useState<IAttachmentCategory[]>([])
  const [tags, setTags] = useState<IAttachmentTag[]>([])
  const [analytics, setAnalytics] = useState<IAttachmentAnalytics | null>(null)
  
  const [loading, setLoading] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [successMsg, setSuccessMsg] = useState<string>('')

  const [activeFilter, setActiveFilter] = useState<IAttachmentFilterOptions>({
    status: 'ACTIVE',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  // Selected file for preview / versions
  const [selectedAttachment, setSelectedAttachment] = useState<IPatientAttachment | null>(null)
  const [versionHistory, setVersionHistory] = useState<IAttachmentVersion[]>([])

  const fetchAttachments = useCallback(async () => {
    try {
      setLoading(true)
      setErrorMsg('')
      const { items, total } = await patientAttachmentApi.getPatientAttachments(patientId, activeFilter)
      setAttachments(items)
      setTotalCount(total)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to load patient attachments.')
    } finally {
      setLoading(false)
    }
  }, [patientId, activeFilter])

  const fetchCategoriesAndTags = useCallback(async () => {
    try {
      const [cats, tgs, stats] = await Promise.all([
        patientAttachmentApi.getCategories(),
        patientAttachmentApi.getTags(),
        patientAttachmentApi.getAnalytics(),
      ])
      setCategories(cats)
      setTags(tgs)
      setAnalytics(stats)
    } catch (err: unknown) {
      console.warn('Failed to load categories or tags metadata', err)
    }
  }, [])

  useEffect(() => {
    fetchAttachments()
  }, [fetchAttachments])

  useEffect(() => {
    fetchCategoriesAndTags()
  }, [fetchCategoriesAndTags])

  const uploadFile = async (dto: IUploadAttachmentDto): Promise<boolean> => {
    try {
      setUploading(true)
      setErrorMsg('')
      setSuccessMsg('')
      const created = await patientAttachmentApi.uploadAttachment(dto)
      setSuccessMsg(`Attachment "${created.originalFileName}" uploaded successfully.`)
      await fetchAttachments()
      await fetchCategoriesAndTags()
      return true
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Upload failed.')
      return false
    } finally {
      setUploading(false)
    }
  }

  const replaceFile = async (attachmentId: string, file: File, reason?: string): Promise<boolean> => {
    try {
      setUploading(true)
      setErrorMsg('')
      const updated = await patientAttachmentApi.replaceAttachment(patientId, attachmentId, file, reason)
      setSuccessMsg(`New version uploaded for "${updated.originalFileName}".`)
      await fetchAttachments()
      if (selectedAttachment && selectedAttachment.id === attachmentId) {
        setSelectedAttachment(updated)
        const vers = await patientAttachmentApi.getVersionHistory(attachmentId)
        setVersionHistory(vers)
      }
      return true
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to upload new version.')
      return false
    } finally {
      setUploading(false)
    }
  }

  const updateMetadata = async (attachmentId: string, dto: IUpdateAttachmentDto): Promise<boolean> => {
    try {
      setErrorMsg('')
      const updated = await patientAttachmentApi.updateAttachment(patientId, attachmentId, dto)
      setSuccessMsg('Attachment metadata updated successfully.')
      await fetchAttachments()
      if (selectedAttachment && selectedAttachment.id === attachmentId) {
        setSelectedAttachment(updated)
      }
      return true
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to update metadata.')
      return false
    }
  }

  const softDelete = async (attachmentId: string): Promise<boolean> => {
    try {
      setErrorMsg('')
      const deleted = await patientAttachmentApi.softDeleteAttachment(patientId, attachmentId)
      setSuccessMsg(`"${deleted.originalFileName}" moved to trash.`)
      await fetchAttachments()
      if (selectedAttachment && selectedAttachment.id === attachmentId) {
        setSelectedAttachment(null)
      }
      return true
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to delete attachment.')
      return false
    }
  }

  const restore = async (attachmentId: string): Promise<boolean> => {
    try {
      setErrorMsg('')
      const restored = await patientAttachmentApi.restoreAttachment(patientId, attachmentId)
      setSuccessMsg(`"${restored.originalFileName}" restored successfully.`)
      await fetchAttachments()
      return true
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to restore attachment.')
      return false
    }
  }

  const loadVersionHistory = async (attachmentId: string) => {
    try {
      const vers = await patientAttachmentApi.getVersionHistory(attachmentId)
      setVersionHistory(vers)
    } catch (err: unknown) {
      console.warn('Failed to load version history', err)
    }
  }

  const addCategory = async (name: string, color: string, icon: string): Promise<boolean> => {
    try {
      await patientAttachmentApi.createCategory(name, color, icon)
      await fetchCategoriesAndTags()
      return true
    } catch {
      return false
    }
  }

  return {
    attachments,
    totalCount,
    categories,
    tags,
    analytics,
    loading,
    uploading,
    errorMsg,
    successMsg,
    activeFilter,
    selectedAttachment,
    versionHistory,
    setActiveFilter,
    setSelectedAttachment,
    fetchAttachments,
    uploadFile,
    replaceFile,
    updateMetadata,
    softDelete,
    restore,
    loadVersionHistory,
    addCategory,
    setErrorMsg,
    setSuccessMsg,
  }
}
