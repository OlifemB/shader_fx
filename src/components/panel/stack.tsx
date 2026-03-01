// src/components/panel/stack.tsx
import { type JSX } from 'react'
import type { EffectInstance } from '@/components/shader.tsx'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface EffectStackProps {
  stack: EffectInstance[]
  setStack: (stack: EffectInstance[]) => void
  updateParam: (id: string, param: string, value: number) => void
  toggle: (id: string, enabled: boolean) => void
  remove: (id: string) => void
}

function EffectCard({
  effect,
  updateParam,
  toggle,
  remove,
}: {
  effect: EffectInstance
  updateParam: (id: string, param: string, value: number) => void
  toggle: (id: string, enabled: boolean) => void
  remove: (id: string) => void
}): JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: effect.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 999 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white/5 border border-white/10 rounded-lg p-3 relative"
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          {...attributes}
          {...listeners}
          className="drag-handle cursor-grab text-gray-400 hover:text-[var(--accent)] select-none"
        >
          ☰
        </div>

        <span className="flex-1 text-sm font-medium text-gray-200">{effect.name}</span>

        <label className="relative inline-block w-8 h-4">
          <input
            type="checkbox"
            checked={effect.enabled}
            onChange={e => toggle(effect.id, e.target.checked)}
            className="opacity-0 w-0 h-0"
          />
          <span className="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-800 rounded-full transition-all before:content-[''] before:absolute before:h-3 before:w-3 before:left-[2px] before:bottom-[2px] before:bg-white before:rounded-full before:transition-all peer-checked:bg-[var(--accent)] peer-checked:before:translate-x-4"></span>
        </label>

        <button
          onClick={() => remove(effect.id)}
          className="text-red-500 text-lg p-1 hover:scale-125 transition-transform"
        >
          ×
        </button>
      </div>

      {effect.enabled && (
        <div className="space-y-2">
          {Object.entries(effect.params).map(([p, [val, min, max]]) => (
            <div
              key={p}
              className="param-row"
            >
              <div className="param-label flex justify-between text-[10px] text-gray-400 mb-1">
                <span>{p}</span>
                <span>{val.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={0.001}
                value={val}
                onChange={e => updateParam(effect.id, p, Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function EffectStack({ stack, setStack, updateParam, toggle, remove }: EffectStackProps): JSX.Element {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = stack.findIndex(e => e.id === active.id)
      const newIndex = stack.findIndex(e => e.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return

      setStack(arrayMove(stack, oldIndex, newIndex))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={stack.map(e => e.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {stack.map(effect => (
            <EffectCard
              key={effect.id}
              effect={effect}
              updateParam={updateParam}
              toggle={toggle}
              remove={remove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
