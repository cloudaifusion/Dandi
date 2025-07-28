import { useState, useCallback } from 'react'

interface ToastProps {
  id?: number
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(({ title, description, variant = 'default' }: ToastProps) => {
    const id = Date.now()
    const newToast = { id, title, description, variant }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return { toast, toasts, dismiss }
}

// Export a simple toast function for direct use
export const toast = ({ title, description, variant = 'default' }: ToastProps) => {
  // For now, we'll use console.log as a simple fallback
  console.log(`[${variant.toUpperCase()}] ${title}: ${description || ''}`)
  
  // In a real implementation, you'd want to use a proper toast library
  // like react-hot-toast, react-toastify, or sonner
} 