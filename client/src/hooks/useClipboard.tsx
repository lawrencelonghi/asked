import { useState } from 'react'

export function useClipboard() {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)

  async function copy(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
  }

  return { copied, hovered, setHovered, copy }
}