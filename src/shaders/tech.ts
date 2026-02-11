export const TECH = {
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
  bloom: {
    cat: 'tech',
    name: 'Свечение',
    params: { intensity: [0.5, 0, 2], threshold: [0.8, 0.5, 1] },
    chunk: (id: string) => `
      vec3 bright = max(color - u_bloomThreshold_${id}, 0.0);
      vec3 bloomColor = bright * u_bloomIntensity_${id};
      color += bloomColor;
    `,
  },
}
