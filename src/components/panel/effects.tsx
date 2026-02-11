import { type JSX } from 'react'
import { EFFECTS_LIB } from '../../effects.ts'
import type { EffectType } from './panel'

interface AddEffectsSectionProps {
  activeTab: string
  addEffect: (type: EffectType) => void
}

export default function AddEffectsSection({ activeTab, addEffect }: AddEffectsSectionProps): JSX.Element {
  return (
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
  )
}
