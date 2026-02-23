export const DISTORT = {
  // --- DISTORT ---
  water: {
    cat: 'distort',
    name: 'Волны',
    params: { speed: [1, 0, 5], power: [0.3, 0, 1] },
    chunk: (id: string) => `
      uv.x += sin(uv.y * 10.0 + u_time * u_waterSpeed_${id}) * 0.02 * u_waterPower_${id};
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  quake: {
    cat: 'distort',
    name: 'Тряска',
    params: { freq: [15, 5, 50], amp: [0.1, 0, 0.5] },
    chunk: (id: string) => `
      uv += (vec2(hash(vec2(u_time)), hash(vec2(u_time + 1.1))) - 0.5) * u_quakeAmp_${id} * step(0.9, hash(vec2(floor(u_time * u_quakeFreq_${id}))));
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  fisheye: {
    cat: 'distort',
    name: 'Рыбий глаз',
    params: { power: [1.5, 0, 3] },
    chunk: (id: string) => `
      vec2 d = uv - 0.5; float r = length(d); uv = 0.5 + normalize(d) * pow(r, u_fisheyePower_${id});
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  liquify: {
    cat: 'distort',
    name: 'Жидкость',
    params: { intensity: [0.5, 0, 2], frequency: [5, 1, 10] },
    chunk: (id: string) => `
      uv += vec2(sin(uv.y * u_liquifyFrequency_${id} + u_time) * u_liquifyIntensity_${id} * 0.05, cos(uv.x * u_liquifyFrequency_${id} + u_time) * u_liquifyIntensity_${id} * 0.05);
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
}
