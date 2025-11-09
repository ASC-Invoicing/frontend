import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import Toast from '.'

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success')
  const [toastDuration, setToastDuration] = useState<number>(5000)

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success', duration: number = 5000) => {
      setToastMessage(message)
      setToastType(type)
      setToastDuration(duration)
    },
    []
  )

  const closeToast = () => setToastMessage(null)

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={toastDuration}
          onClose={closeToast}
        />
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('ToastProvider Error')
  }
  return context
}
