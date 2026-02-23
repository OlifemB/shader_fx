import { type JSX } from 'react'
import type { EffectCategory } from './panel'

interface TabsNavProps {
  categories: EffectCategory[]
  activeTab: EffectCategory
  setActiveTab: (tab: EffectCategory) => void
}

export default function TabsNav({ categories, activeTab, setActiveTab }: TabsNavProps): JSX.Element {
  return (
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
  )
}
