import type { ChangeEvent, FocusEvent } from 'react'
import { useState } from 'react'

export interface ValidationRules {
  required?: boolean
  isEmail?: boolean
  minLength?: number
}

export interface UseAuthFormProps<T> {
  initialValues: T
  validationRules: Partial<Record<keyof T, ValidationRules>>
  onSubmit: (values: T) => void | Promise<void>
}

export function useAuthForm<T extends Record<string, string>>({
  initialValues,
  validationRules,
  onSubmit,
}: UseAuthFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const validateField = (name: keyof T, value: string): string => {
    const rules = validationRules[name]
    if (!rules) return ''

    if (rules.required && !value.trim()) {
      return 'This field is required.'
    }

    if (rules.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address.'
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters.`
    }

    return ''
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Partial<Record<keyof T, string>> = {}
    let hasErrors = false

    Object.keys(values).forEach((key) => {
      const error = validateField(key, values[key])
      if (error) {
        newErrors[key as keyof T] = error
        hasErrors = true
      }
    })

    setErrors(newErrors)
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}) as Partial<
        Record<keyof T, boolean>
      >
    )

    if (hasErrors) return

    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await onSubmit(values)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return {
    values,
    errors,
    touched,
    loading,
    successMsg,
    errorMsg,
    setValues,
    setErrors,
    setLoading,
    setSuccessMsg,
    setErrorMsg,
    handleChange,
    handleBlur,
    handleSubmit,
  }
}
