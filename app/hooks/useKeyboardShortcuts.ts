import { useEffect, useCallback } from 'react'

interface ShortcutHandlers {
  onBuy?: () => void
  onSell?: () => void
  onCancel?: () => void
  onIncreaseAmount?: () => void
  onDecreaseAmount?: () => void
  onIncreaseLeverage?: () => void
  onDecreaseLeverage?: () => void
  onConfirm?: () => void
}

export function useKeyboardShortcuts({
  onBuy,
  onSell,
  onCancel,
  onIncreaseAmount,
  onDecreaseAmount,
  onIncreaseLeverage,
  onDecreaseLeverage,
  onConfirm,
}: ShortcutHandlers) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts if user is typing in an input
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return
    }

    switch (event.key.toLowerCase()) {
      case 'b':
        onBuy?.()
        break
      case 's':
        onSell?.()
        break
      case 'escape':
        onCancel?.()
        break
      case 'arrowup':
        if (event.shiftKey) {
          onIncreaseLeverage?.()
        } else {
          onIncreaseAmount?.()
        }
        break
      case 'arrowdown':
        if (event.shiftKey) {
          onDecreaseLeverage?.()
        } else {
          onDecreaseAmount?.()
        }
        break
      case 'enter':
        if (!event.shiftKey && !event.ctrlKey && !event.altKey) {
          onConfirm?.()
        }
        break
    }
  }, [
    onBuy,
    onSell,
    onCancel,
    onIncreaseAmount,
    onDecreaseAmount,
    onIncreaseLeverage,
    onDecreaseLeverage,
    onConfirm,
  ])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])
} 