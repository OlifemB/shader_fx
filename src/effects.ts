export const EFFECTS_LIB = {
  // --- DISTORT ---
  water: {
    cat: 'distort',
    name: 'Волны',
    params: { speed: [1, 0, 5], power: [0.3, 0, 1] },
    chunk: (id: string) => `uv.x += sin(uv.y * 10.0 + u_time * u_waterSpeed_${id}) * 0.02 * u_waterPower_${id};`,
  },
  quake: {
    cat: 'distort',
    name: 'Тряска',
    params: { freq: [15, 5, 50], amp: [0.1, 0, 0.5] },
    chunk: (id: string) =>
      `uv += (vec2(hash(vec2(u_time)), hash(vec2(u_time + 1.1))) - 0.5) * u_quakeAmp_${id} * step(0.9, hash(vec2(floor(u_time * u_quakeFreq_${id}))));`,
  },
  fisheye: {
    cat: 'distort',
    name: 'Рыбий глаз',
    params: { power: [1.5, 0, 3] },
    chunk: (id: string) =>
      `vec2 d = uv - 0.5; float r = length(d); uv = 0.5 + normalize(d) * pow(r, u_fisheyePower_${id});`,
  },

  // --- COLOR ---
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

  // --- ART ---
  ascii: {
    cat: 'art',
    name: 'ASCII Символы',
    params: { size: [80, 20, 200] },
    chunk: (id: string) => `
      vec2 auv = floor(uv * u_asciiSize_${id}) / u_asciiSize_${id};
      float l = dot(texture2D(u_texture, auv).rgb, vec3(0.299, 0.587, 0.114));
      float p = step(0.5, fract(uv.x * u_asciiSize_${id})) * step(0.5, fract(uv.y * u_asciiSize_${id}));
      color = mix(vec3(0.0), texture2D(u_texture, auv).rgb, step(1.0 - l, p));`,
  },
  pixel: {
    cat: 'art',
    name: 'Пикселизация',
    params: { res: [100, 10, 500] },
    chunk: (id: string) =>
      `uv = floor(uv * u_pixelRes_${id}) / u_pixelRes_${id}; color = texture2D(u_texture, uv).rgb;`,
  },
  edge: {
    cat: 'art',
    name: 'Контуры',
    params: { width: [1, 0.1, 5], mix: [1, 0, 1] },
    chunk: (id: string) => `
      float w = u_edgeWidth_${id} / 1000.0;
      float e = length(texture2D(u_texture, uv+w).rgb - texture2D(u_texture, uv-w).rgb);
      color = mix(color, vec3(e), u_edgeMix_${id});`,
  },

  // --- GEO ---
  mirror: {
    cat: 'geo',
    name: 'Зеркало X/Y',
    params: { mode: [0, 0, 3] },
    chunk: (id: string) => `
      if(u_mirrorMode_${id} < 1.0) { if(uv.x > 0.5) uv.x = 1.0 - uv.x; }
      else if(u_mirrorMode_${id} < 2.0) { if(uv.y > 0.5) uv.y = 1.0 - uv.y; }
      else { if(uv.x > 0.5) uv.x = 1.0 - uv.x; if(uv.y > 0.5) uv.y = 1.0 - uv.y; }`,
  },
  kaleido: {
    cat: 'geo',
    name: 'Калейдоскоп',
    params: { seg: [6, 2, 12] },
    chunk: (id: string) => `
      vec2 k = uv - 0.5; float r = length(k); float a = atan(k.y, k.x);
      float s = 6.28 / u_kaleidoSeg_${id}; a = mod(a, s); if(a > s*0.5) a = s - a;
      uv = 0.5 + vec2(cos(a), sin(a)) * r;`,
  },
  zoom: {
    cat: 'geo',
    name: 'Динамик Зум',
    params: { val: [1, 0.5, 3] },
    chunk: (id: string) => `uv = (uv - 0.5) / u_zoomVal_${id} + 0.5;`,
  },

  // --- TECH ---
  glitch_rgb: {
    cat: 'tech',
    name: 'RGB Глитч',
    params: { amt: [0.2, 0, 1] },
    chunk: (id: string) => `
      float g_o = u_glitch_rgbAmt_${id} * 0.05 * hash(vec2(u_time));
      color.r = texture2D(u_texture, uv + vec2(g_o, 0)).r;
      color.b = texture2D(u_texture, uv - vec2(g_o, 0)).b;`,
  },
  sharpen: {
    cat: 'tech',
    name: 'Резкость',
    params: { val: [1, 0, 5] },
    chunk: (id: string) => `
      vec3 center = texture2D(u_texture, uv).rgb;
      vec3 avg = (texture2D(u_texture, uv+0.001).rgb + texture2D(u_texture, uv-0.001).rgb) / 2.0;
      color = center + (center - avg) * u_sharpenVal_${id};`,
  },
  vignette: {
    cat: 'tech',
    name: 'Виньетка',
    params: { fall: [0.5, 0, 1] },
    chunk: (id: string) => `color *= smoothstep(0.8, 0.8 - u_vignetteFall_${id}, distance(uv, vec2(0.5)));`,
  },

  // --- MOUSE ---
  bulge: {
    cat: 'mouse',
    name: 'Выпуклость',
    params: { radius: [0.3, 0.1, 1.0], strength: [0.5, 0, 1.0] },
    chunk: (id: string) =>
      `vec2 m = u_mouse; float d = distance(uv, m); 
      if(d < u_bulgeRadius_${id}) { uv -= (m - uv) * (u_bulgeRadius_${id} - d) * u_bulgeStrength_${id}; color = texture2D(u_texture, uv).rgb; }`,
  },
  flashlight: {
    cat: 'mouse',
    name: 'Фонарик',
    params: { size: [0.2, 0.05, 0.5] },
    chunk: (id: string) =>
      `float d = distance(uv, u_mouse); 
      color *= smoothstep(u_flashlightSize_${id}, u_flashlightSize_${id}*0.5, d);`,
  },
}
