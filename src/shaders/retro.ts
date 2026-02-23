export const RETRO = {
  // --- RETRO ---
  vhs: {
    cat: 'retro',
    name: 'VHS статика',
    params: { jitter: [0.2, 0, 1], noise: [0.1, 0, 0.5] },
    chunk: (id: string) => `
      float v_n = hash(uv + u_time) * u_vhsNoise_${id};
      if(hash(vec2(u_time*10.0, uv.y)) > 0.98 - u_vhsJitter_${id}*0.1) uv.x += (hash(vec2(u_time))-0.5)*0.05;
      color += v_n;`,
  },
  crt: {
    cat: 'retro',
    name: 'ЭЛТ Сетка',
    params: { scan: [0.5, 0, 1], curve: [0.1, 0, 0.5] },
    chunk: (id: string) => `
      vec2 cuv = (uv - 0.5) * (1.0 + u_crtCurve_${id} * dot(uv-0.5, uv-0.5)); uv = cuv + 0.5;
      color *= 1.0 - sin(uv.y * 800.0) * 0.1 * u_crtScan_${id};
      if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0) color *= 0.0;`,
  },
  grain: {
    cat: 'retro',
    name: 'Кинопленка',
    params: { size: [1, 0.5, 3], val: [0.1, 0, 0.3] },
    chunk: (id: string) => `color -= hash(floor(uv*500.0/u_grainSize_${id}) + u_time) * u_grainVal_${id};`,
  },
  scanlines: {
    cat: 'retro',
    name: 'Сканлайны',
    params: { intensity: [0.5, 0, 1], density: [500, 100, 1000] },
    chunk: (id: string) => `color *= 1.0 - abs(sin(uv.y * u_scanlinesDensity_${id})) * u_scanlinesIntensity_${id};`,
  },
}