import { type JSX, useState, useRef } from 'react'
import { EFFECTS_LIB } from '../../effects.ts'
import type { EffectInstance } from '@/components/shader.tsx'
import PanelHeader from './header'
import TabsNav from './tabs'
import AddEffectsSection from './effects.tsx'
import EffectStack from './stack'
import * as React from 'react'

export type EffectType = keyof typeof EFFECTS_LIB
export type EffectCategory = 'distort' | 'color' | 'retro' | 'art' | 'geo' | 'tech' | 'mouse'

interface ControlPanelProps {
  stack: EffectInstance[]
  setStack: (stack: EffectInstance[]) => void
  addEffect: (type: EffectType) => void
  updateParam: (id: string, param: string, value: number) => void
  toggle: (id: string, enabled: boolean) => void
  remove: (id: string) => void
}

const categories: EffectCategory[] = ['distort', 'color', 'retro', 'art', 'geo', 'tech', 'mouse']

export default function Panel({
  stack,
  setStack,
  addEffect,
  updateParam,
  toggle,
  remove,
}: ControlPanelProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<EffectCategory>('distort')
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragging.current = true
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return
    setPosition({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y })
  }

  const handleMouseUp = () => {
    dragging.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      className="fixed w-[400px] max-h-[90vh] flex flex-col bg-[rgba(15,16,22,0.9)] backdrop-blur-[30px] border border-white/10 rounded-2xl z-50 overflow-y-hidden"
      style={{ left: position.x, top: position.y, '--accent': '#00ffa3' } as React.CSSProperties}
    >
      <PanelHeader
        onMouseDown={handleMouseDown}
        title="ShaderFX"
      />
      <TabsNav
        categories={categories}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <AddEffectsSection
        activeTab={activeTab}
        addEffect={addEffect}
      />
      <EffectStack
        stack={stack}
        setStack={setStack}
        updateParam={updateParam}
        toggle={toggle}
        remove={remove}
      />
    </div>
  )
}
