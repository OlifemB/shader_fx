// src/shaders/color.ts
export const COLOR = {
  exposure: {
    cat: 'color',
    name: 'Экспозиция',
    params: { val: [1.2, 0, 3] },
    chunk: (id: string) => `color *= u_exposureVal_${id};`,
  },
  saturation: {
    cat: 'color',
    name: 'Насыщенность',
    params: { val: [1.5, 0, 3] },
    chunk: (id: string) =>
      `float gray = dot(color, vec3(0.299, 0.587, 0.114)); color = mix(vec3(gray), color, u_saturationVal_${id});`,
  },
  thermal: {
    cat: 'color',
    name: 'Тепловизор',
    params: { mix: [1, 0, 1] },
    chunk: (id: string) => `
      float l = dot(color, vec3(0.299, 0.587, 0.114));
      vec3 tc = mix(vec3(0,0,0.5), vec3(0,1,0), smoothstep(0.0, 0.5, l));
      tc = mix(tc, vec3(1,1,0), smoothstep(0.5, 0.8, l));
      tc = mix(tc, vec3(1,0,0), smoothstep(0.8, 1.0, l));
      color = mix(color, tc, u_thermalMix_${id});`,
  },
  sepia: {
    cat: 'color',
    name: 'Сепия',
    params: { mix: [1, 0, 1] },
    chunk: (id: string) =>
      `vec3 sc = vec3(dot(color, vec3(0.393, 0.769, 0.189)), dot(color, vec3(0.349, 0.686, 0.168)), dot(color, vec3(0.272, 0.534, 0.131))); color = mix(color, sc, u_sepiaMix_${id});`,
  },
  contrast: {
    cat: 'color',
    name: 'Контраст',
    params: { val: [1.5, 0, 3] },
    chunk: (id: string) => `color = (color - 0.5) * u_contrastVal_${id} + 0.5;`,
  },
}
