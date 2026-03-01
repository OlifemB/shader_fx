// src/components/panel/header.tsx
import { type JSX } from 'react'
import * as React from 'react'

interface PanelHeaderProps {
  title: string
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
}

export default function PanelHeader({ title, onMouseDown }: PanelHeaderProps): JSX.Element {
  return (
    <div
      className="flex justify-between items-center px-5 py-4 border-b border-white/5 cursor-move"
      onMouseDown={onMouseDown}
    >
      <h1 className="text-base font-bold text-[var(--accent)]">{title}</h1>
    </div>
  )
}
