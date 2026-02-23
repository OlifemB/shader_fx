export const ART = {
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
    chunk: (id: string) => `
      uv = floor(uv * u_pixelRes_${id}) / u_pixelRes_${id};
      color = texture2D(u_texture, uv).rgb;  // Уже есть обновление
    `,
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
  sobel: {
    cat: 'art',
    name: 'Собель края',
    params: { intensity: [1, 0, 5] },
    chunk: (id: string) => `
      vec3 gx = texture2D(u_texture, uv + vec2(0.001, 0)).rgb - texture2D(u_texture, uv - vec2(0.001, 0)).rgb;
      vec3 gy = texture2D(u_texture, uv + vec2(0, 0.001)).rgb - texture2D(u_texture, uv - vec2(0, 0.001)).rgb;
      float edge = length(gx) + length(gy);
      color = vec3(edge * u_sobelIntensity_${id});`,
  },
}
