import { type JSX, useState, useRef } from 'react'
import { EFFECTS_LIB } from '../effects.ts'
import type { EffectInstance } from '@/components/shader.tsx'

export type EffectType = keyof typeof EFFECTS_LIB
export type EffectCategory = 'distort' | 'color' | 'retro' | 'art' | 'geo' | 'tech' | 'mouse'

interface ControlPanelProps {
  stack: EffectInstance[]
  addEffect: (type: EffectType) => void
  updateParam: (id: string, param: string, value: number) => void
  toggle: (id: string, enabled: boolean) => void
  remove: (id: string) => void
}

const categories: EffectCategory[] = ['distort', 'color', 'retro', 'art', 'geo', 'tech', 'mouse']

export default function Panel({ stack, addEffect, updateParam, toggle, remove }: ControlPanelProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<EffectCategory>('distort')

  // DnD state
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragging.current = true
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    })
  }

  const handleMouseUp = () => {
    dragging.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      className="fixed w-[400px] max-h-[90vh] flex flex-col bg-[rgba(15,16,22,0.9)] backdrop-blur-[30px] border border-white/10 rounded-2xl z-50"
      style={
        {
          left: position.x,
          top: position.y,
          '--accent': '#00ffa3',
          '--accent-glow': 'rgba(0,255,163,0.4)',
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <div
        className="flex justify-between items-center px-5 py-4 border-b border-white/5 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <h1 className="text-base font-bold text-[var(--accent)]">EchoFX Pro</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-2 py-2 overflow-x-auto bg-black/20 scrollbar-thin scrollbar-thumb-white/10">
        {categories.map(c => (
          <button
            key={c}
            className={`px-3 py-1 text-xs rounded-md whitespace-nowrap font-semibold ${
              activeTab === c ? 'bg-[var(--accent)] text-black' : 'bg-white/5 text-gray-400'
            }`}
            onClick={() => setActiveTab(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Add Buttons */}
      <div className="px-3 py-3 border-b border-white/10">
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(EFFECTS_LIB) as [EffectType, (typeof EFFECTS_LIB)[EffectType]][])
            .filter(([_, e]) => e.cat === activeTab)
            .map(([key, e]) => (
              <button
                key={key}
                className="bg-white/5 border border-white/10 text-gray-200 text-xs px-2 py-1 rounded-md text-left hover:border-[var(--accent)]"
                onClick={() => addEffect(key)}
              >
                + {e.name}
              </button>
            ))}
        </div>
      </div>

      {/* Stack */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {stack.map(eff => (
          <div
            key={eff.id}
            className="bg-white/5 border border-white/10 rounded-lg p-3 relative cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="flex-1 text-sm font-medium text-gray-200">{eff.name}</span>

              <input
                type="checkbox"
                checked={eff.enabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => toggle(eff.id, e.target.checked)}
                className="w-4 h-4 accent-[var(--accent)]"
              />

              <button
                onClick={() => remove(eff.id)}
                className="text-red-500 text-lg p-1 hover:scale-125 transition-transform"
              >
                ×
              </button>
            </div>

            {eff.enabled &&
              Object.entries(eff.params).map(([p, [val, min, max]]) => (
                <div
                  key={p}
                  className="flex flex-col gap-1 mb-2"
                >
                  <label className="flex justify-between text-[10px] text-gray-400 font-semibold">
                    {p}: {val.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={0.001}
                    value={val}
                    onChange={e => updateParam(eff.id, p, Number(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}
