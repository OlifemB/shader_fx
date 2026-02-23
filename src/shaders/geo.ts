export const GEO = {
  // --- GEO ---
  mirror: {
    cat: 'geo',
    name: 'Зеркало X/Y',
    params: { mode: [0, 0, 3] },
    chunk: (id: string) => `
      if(u_mirrorMode_${id} < 1.0) { if(uv.x > 0.5) uv.x = 1.0 - uv.x; }
      else if(u_mirrorMode_${id} < 2.0) { if(uv.y > 0.5) uv.y = 1.0 - uv.y; }
      else { if(uv.x > 0.5) uv.x = 1.0 - uv.x; if(uv.y > 0.5) uv.y = 1.0 - uv.y; }
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  kaleido: {
    cat: 'geo',
    name: 'Калейдоскоп',
    params: { seg: [6, 2, 12] },
    chunk: (id: string) => `
      vec2 k = uv - 0.5; float r = length(k); float a = atan(k.y, k.x);
      float s = 6.28 / u_kaleidoSeg_${id}; a = mod(a, s); if(a > s*0.5) a = s - a;
      uv = 0.5 + vec2(cos(a), sin(a)) * r;
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  zoom: {
    cat: 'geo',
    name: 'Динамик Зум',
    params: { val: [1, 0.5, 3] },
    chunk: (id: string) => `
      uv = (uv - 0.5) / u_zoomVal_${id} + 0.5;
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  rotate: {
    cat: 'geo',
    name: 'Вращение',
    params: { angle: [0.5, 0, 3.14], speed: [1, 0, 5] },
    chunk: (id: string) => `
      float ang = u_rotateAngle_${id} + u_time * u_rotateSpeed_${id};
      vec2 piv = vec2(0.5);
      uv -= piv;
      uv = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * uv;
      uv += piv;
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
}
