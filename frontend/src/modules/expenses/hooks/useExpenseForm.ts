import { useState, useCallback, useEffect } from 'react'
import type { CreateExpenseDto, UpdateExpenseDto, PaymentMethod } from '../types/expense'

export interface ExpenseFormValues {
  clinicId: string
  categoryId: string
  title: string
  description: string
  amount: string
  currency: string
  expenseDate: string
  paymentDate: string
  paymentMethod: PaymentMethod
  vendorName: string
  vendorTaxId: string
  notes: string
}

export interface ExpenseFormErrors {
  categoryId?: string
  title?: string
  amount?: string
  currency?: string
  expenseDate?: string
  paymentMethod?: string
}

export function useExpenseForm(initialValues?: Partial<ExpenseFormValues>) {
  const getTodayDateString = () => new Date().toISOString().split('T')[0]

  const [values, setValues] = useState<ExpenseFormValues>({
    clinicId: initialValues?.clinicId || 'branch_main',
    categoryId: initialValues?.categoryId || '',
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    amount: initialValues?.amount || '',
    currency: initialValues?.currency || 'USD',
    expenseDate: initialValues?.expenseDate || getTodayDateString(),
    paymentDate: initialValues?.paymentDate || '',
    paymentMethod: initialValues?.paymentMethod || 'BANK_TRANSFER',
    vendorName: initialValues?.vendorName || '',
    vendorTaxId: initialValues?.vendorTaxId || '',
    notes: initialValues?.notes || '',
  })

  const [errors, setErrors] = useState<ExpenseFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Populate form if initial values change (for editing)
  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({
        ...prev,
        ...initialValues,
      }))
    }
  }, [initialValues])

  const validate = useCallback((): boolean => {
    const newErrors: ExpenseFormErrors = {}

    if (!values.categoryId.trim()) {
      newErrors.categoryId = 'Category is required'
    }

    if (!values.title.trim()) {
      newErrors.title = 'Title is required'
    }

    const numAmount = parseFloat(values.amount)
    if (!values.amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Amount must be a positive number greater than 0'
    }

    if (!values.currency.trim() || values.currency.length !== 3) {
      newErrors.currency = 'Valid 3-letter currency code required'
    }

    if (!values.expenseDate) {
      newErrors.expenseDate = 'Expense Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values])

  const handleChange = useCallback((field: keyof ExpenseFormValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }))
  }, [])

  const toCreatePayload = useCallback(
    (submitForApproval = false): CreateExpenseDto => {
      return {
        clinicId: values.clinicId,
        categoryId: values.categoryId,
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        amount: parseFloat(values.amount) || 0,
        currency: values.currency.trim().toUpperCase(),
        expenseDate: values.expenseDate,
        paymentDate: values.paymentDate || undefined,
        paymentMethod: values.paymentMethod,
        vendorName: values.vendorName.trim() || undefined,
        vendorTaxId: values.vendorTaxId.trim() || undefined,
        notes: values.notes.trim() || undefined,
        submitForApproval,
      }
    },
    [values]
  )

  const toUpdatePayload = useCallback((): UpdateExpenseDto => {
    return {
      categoryId: values.categoryId,
      title: values.title.trim(),
      description: values.description.trim() || undefined,
      amount: parseFloat(values.amount) || 0,
      currency: values.currency.trim().toUpperCase(),
      expenseDate: values.expenseDate,
      paymentDate: values.paymentDate || undefined,
      paymentMethod: values.paymentMethod,
      vendorName: values.vendorName.trim() || undefined,
      vendorTaxId: values.vendorTaxId.trim() || undefined,
      notes: values.notes.trim() || undefined,
    }
  }, [values])

  return {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validate,
    toCreatePayload,
    toUpdatePayload,
    setValues,
  }
}
