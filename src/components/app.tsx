import { useState, type JSX } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import Panel from './panel/panel.tsx'
import { EFFECTS_LIB } from '@/shaders'
import ShaderQuad, { type EffectInstance } from '@/components/shader.tsx'

type EffectType = keyof typeof EFFECTS_LIB

export default function App(): JSX.Element {
  const [stack, setStack] = useState<EffectInstance[]>([])
  const [imageUrl, setImageUrl] = useState<string>('https://picsum.photos/1024/1024')

  const addEffect = (type: EffectType) => {
    const id = Math.random().toString(36).slice(2, 7)
    const original = EFFECTS_LIB[type]

    const instance: EffectInstance = {
      ...original,
      id,
      type,
      enabled: true,
      params: JSON.parse(JSON.stringify(original.params)),
    }

    setStack(prev => [...prev, instance])
  }

  const updateParam = (id: string, param: string, value: number) => {
    setStack(prev =>
      prev.map(e =>
        e.id === id
          ? {
              ...e,
              params: {
                ...e.params,
                [param]: [value, e.params[param][1], e.params[param][2]],
              },
            }
          : e
      )
    )
  }

  const toggle = (id: string, enabled: boolean) => {
    setStack(prev => prev.map(e => (e.id === id ? { ...e, enabled } : e)))
  }

  const remove = (id: string) => {
    setStack(prev => prev.filter(e => e.id !== id))
  }

  return (
    <>
      <Canvas gl={{ antialias: true }}>
        <OrthographicCamera
          makeDefault
          position={[0, 0, 1]}
        />
        <ShaderQuad
          stack={stack}
          imageUrl={imageUrl}
        />
      </Canvas>

      <Panel
        stack={stack}
        setStack={setStack}
        addEffect={addEffect}
        updateParam={updateParam}
        toggle={toggle}
        remove={remove}
        setImageUrl={setImageUrl}
      />
    </>
  )
}
