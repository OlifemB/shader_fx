/// src/components/shader.tsx
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { TEXTURE } from '@/assets/consts.ts'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { capitalize } from '@/assets/utils.ts'

type EffectParam = [number, number, number]
export interface EffectInstance {
  id: string
  type: string
  name: string
  cat: string
  enabled: boolean
  params: Record<string, EffectParam>
  chunk: (id: string) => string
}

export default function ShaderQuad({ stack }: { stack: EffectInstance[] }) {
  const texture = useTexture(TEXTURE)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()
  const [mouse, setMouse] = useState([0.5, 0.5])

  // --- отслеживаем мышь и нормализуем координаты [0,1] ---
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMouse([e.clientX / size.width, 1 - e.clientY / size.height])
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [size])

  const baseUniforms = useMemo(
    () => ({
      u_texture: { value: texture },
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(mouse[0], mouse[1]) },
    }),
    [texture]
  )

  useFrame(state => {
    const mat = materialRef.current
    if (!mat) return
    mat.uniforms.u_time.value = state.clock.elapsedTime
    mat.uniforms.u_mouse.value.set(mouse[0], mouse[1])
  })

  // --- ключ для пересборки шейдера ---
  const rebuildKey = useMemo(() => {
    return stack
      .map(eff => `${eff.id}-${eff.enabled ? 'on' : 'off'}-${Object.keys(eff.params).sort().join(',')}`)
      .sort()
      .join('|')
  }, [stack])

  // --- собираем шейдер ---
  useEffect(() => {
    const mat = materialRef.current
    if (!mat || !mat.uniforms) return

    mat.uniforms.u_texture.value = texture

    let uniformsDecl = `
      uniform sampler2D u_texture;
      uniform float u_time;
      uniform vec2 u_mouse;
    `
    let mainBody = `
      vec2 uv = vUv;
      vec3 color = texture2D(u_texture, uv).rgb;
    `

    const activeStack = stack.filter(eff => eff.enabled)
    activeStack.forEach(eff => {
      Object.entries(eff.params).forEach(([p, [val]]) => {
        const uName = `u_${eff.type}${capitalize(p)}_${eff.id}`
        uniformsDecl += `uniform float ${uName};\n`
        if (!(uName in mat.uniforms)) {
          mat.uniforms[uName] = { value: val }
        }
      })
      mainBody += `{ ${eff.chunk(eff.id)} }`
    })

    // удаляем неиспользуемые uniform
    Object.keys(mat.uniforms).forEach(key => {
      if (key.startsWith('u_') && key !== 'u_texture' && key !== 'u_time' && key !== 'u_mouse') {
        const isUsed = activeStack.some(eff =>
          Object.keys(eff.params).some(p => `u_${eff.type}${capitalize(p)}_${eff.id}` === key)
        )
        if (!isUsed) delete mat.uniforms[key]
      }
    })

    mat.fragmentShader = `
      ${uniformsDecl}
      varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      void main(){
        ${mainBody}
        gl_FragColor = vec4(color,1.0);
      }
    `
    mat.needsUpdate = true
  }, [rebuildKey, texture])

  // --- обновляем значения uniform при изменении stack ---
  useEffect(() => {
    const mat = materialRef.current
    if (!mat || !mat.uniforms) return

    stack.forEach(eff => {
      if (!eff.enabled) return
      Object.entries(eff.params).forEach(([p, [val]]) => {
        const uName = `u_${eff.type}${capitalize(p)}_${eff.id}`
        const uniform = mat.uniforms[uName]
        if (uniform) uniform.value = val
      })
    })
  }, [stack])

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={`
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = vec4(position,1.0); }
        `}
        uniforms={baseUniforms}
      />
    </mesh>
  )
}
