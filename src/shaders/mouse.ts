export const MOUSE = {
  // --- MOUSE ---
  bulge: {
    cat: 'mouse',
    name: 'Выпуклость',
    params: { radius: [0.3, 0.1, 1.0], strength: [0.5, 0, 1.0] },
    chunk: (id: string) => `
      vec2 m = u_mouse; float d = distance(uv, m); 
      if(d < u_bulgeRadius_${id}) { uv -= (m - uv) * (u_bulgeRadius_${id} - d) * u_bulgeStrength_${id}; color = texture2D(u_texture, uv).rgb; }
    `, // Уже есть обновление
  },
  flashlight: {
    cat: 'mouse',
    name: 'Фонарик',
    params: { size: [0.2, 0.05, 0.5] },
    chunk: (id: string) => `
      float d = distance(uv, u_mouse); 
      color *= smoothstep(u_flashlightSize_${id}, u_flashlightSize_${id}*0.5, d);
    `,
  },
  rippleMouse: {
    cat: 'mouse',
    name: 'Круги на воде',
    params: { amplitude: [0.05, 0, 0.2], frequency: [20, 5, 50] },
    chunk: (id: string) => `
      vec2 m = u_mouse;
      float dist = distance(uv, m);
      uv += normalize(uv - m) * sin(dist * u_rippleMouseFrequency_${id} - u_time) * u_rippleMouseAmplitude_${id} * smoothstep(0.5, 0.0, dist);
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  magnifyMouse: {
    cat: 'mouse',
    name: 'Лупа',
    params: { zoom: [2, 1, 5], radius: [0.2, 0.1, 0.5] },
    chunk: (id: string) => `
      vec2 m = u_mouse;
      float d = distance(uv, m);
      if (d < u_magnifyMouseRadius_${id}) {
        uv = m + (uv - m) / u_magnifyMouseZoom_${id};
      }
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  colorShiftMouse: {
    cat: 'mouse',
    name: 'Сдвиг цвета',
    params: { intensity: [0.5, 0, 1], radius: [0.3, 0.1, 0.8] },
    chunk: (id: string) => `
      vec2 m = u_mouse;
      float d = distance(uv, m);
      if (d < u_colorShiftMouseRadius_${id}) {
        float shift = u_colorShiftMouseIntensity_${id} * (1.0 - d / u_colorShiftMouseRadius_${id});
        color = color.rgb * (1.0 - shift) + color.gbr * shift;
      }
    `, // Меняет color, ок
  },
  blurMouse: {
    cat: 'mouse',
    name: 'Размытие',
    params: { strength: [0.01, 0, 0.05], radius: [0.4, 0.1, 1] },
    chunk: (id: string) => `
      vec2 m = u_mouse;
      float d = distance(uv, m);
      if (d < u_blurMouseRadius_${id}) {
        vec3 sum = vec3(0.0);
        float blurAmt = u_blurMouseStrength_${id} * (1.0 - d / u_blurMouseRadius_${id});
        for (int i = -2; i <= 2; i++) {
          for (int j = -2; j <= 2; j++) {
            sum += texture2D(u_texture, uv + vec2(float(i), float(j)) * blurAmt).rgb;
          }
        }
        color = sum / 25.0;
      }
    `, // Меняет color, ок
  },
  vortexMouse: {
    cat: 'mouse',
    name: 'Вихрь',
    params: { strength: [1, 0, 5], radius: [0.3, 0.1, 0.8] },
    chunk: (id: string) => `
      vec2 m = u_mouse;
      vec2 dir = uv - m;
      float d = length(dir);
      if (d < u_vortexMouseRadius_${id}) {
        float angle = u_vortexMouseStrength_${id} * (1.0 - d / u_vortexMouseRadius_${id}) / d;
        uv = m + mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * dir;
      }
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  invertMouse: {
    cat: 'mouse',
    name: 'Инверсия',
    params: { radius: [0.25, 0.1, 0.6] },
    chunk: (id: string) => `
      vec2 m = u_mouse;
      float d = distance(uv, m);
      if (d < u_invertMouseRadius_${id}) {
        color = 1.0 - color;
      }
    `, // Меняет color, ок
  },
  pixelateMouse: {
    cat: 'mouse',
    name: 'Пикселизация у мыши',
    params: { res: [20, 5, 100], radius: [0.3, 0.1, 0.7] },
    chunk: (id: string) => `
      vec2 m = u_mouse;
      float d = distance(uv, m);
      if (d < u_pixelateMouseRadius_${id}) {
        float pixelSize = u_pixelateMouseRes_${id} * (d / u_pixelateMouseRadius_${id});
        uv = floor(uv * pixelSize) / pixelSize;
      }
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  glowMouse: {
    cat: 'mouse',
    name: 'Свечение у мыши',
    params: { intensity: [0.5, 0, 1], radius: [0.2, 0.05, 0.5] },
    chunk: (id: string) => `
      vec2 m = u_mouse;
      float d = distance(uv, m);
      float glow = u_glowMouseIntensity_${id} * smoothstep(u_glowMouseRadius_${id}, 0.0, d);
      color += vec3(glow);
    `, // Меняет color, ок
  },
  mouse_wave: {
    cat: 'mouse',
    name: 'Волна от мыши',
    params: { radius: [0.3, 0.1, 1], speed: [2, 0, 10], power: [0.5, 0, 2] },
    chunk: (id: string) => `
      vec2 d = uv - u_mouse;
      float dist = length(d);
      if(dist < u_mouse_waveRadius_${id}) {
        uv += normalize(d) * sin(u_time * u_mouse_waveSpeed_${id} - dist*10.0) * u_mouse_wavePower_${id};
      }
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  mouse_pinch: {
    cat: 'mouse',
    name: 'Сжатие мышью',
    params: { radius: [0.3, 0.1, 1], strength: [0.5, 0, 2] },
    chunk: (id: string) => `
      vec2 d = uv - u_mouse;
      float dist = length(d);
      if(dist < u_mouse_pinchRadius_${id}) uv -= d * (1.0 - dist / u_mouse_pinchRadius_${id}) * u_mouse_pinchStrength_${id};
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  mouse_twist: {
    cat: 'mouse',
    name: 'Вращение мышью',
    params: { radius: [0.3, 0.1, 1], angle: [3.14, 0, 6.28] },
    chunk: (id: string) => `
      vec2 d = uv - u_mouse;
      float dist = length(d);
      if(dist < u_mouse_twistRadius_${id}) {
        float a = atan(d.y, d.x) + (1.0 - dist/u_mouse_twistRadius_${id}) * u_mouse_twistAngle_${id};
        uv = u_mouse + vec2(cos(a), sin(a)) * dist;
      }
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  mouse_swirl: {
    cat: 'mouse',
    name: 'Вихрь мышью',
    params: { radius: [0.3, 0.1, 1], strength: [1, 0, 5] },
    chunk: (id: string) => `
      vec2 d = uv - u_mouse;
      float dist = length(d);
      if(dist < u_mouse_swirlRadius_${id}) {
        float a = u_mouse_swirlStrength_${id} * (u_mouse_swirlRadius_${id} - dist);
        uv = u_mouse + vec2(
          cos(a) * d.x - sin(a) * d.y,
          sin(a) * d.x + cos(a) * d.y
        );
      }
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  mouse_pull: {
    cat: 'mouse',
    name: 'Притяжение мышью',
    params: { radius: [0.5, 0.1, 1], strength: [0.5, 0, 2] },
    chunk: (id: string) => `
      vec2 d = u_mouse - uv;
      float dist = length(d);
      if(dist < u_mouse_pullRadius_${id}) uv += d * (1.0 - dist / u_mouse_pullRadius_${id}) * u_mouse_pullStrength_${id};
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  mouse_push: {
    cat: 'mouse',
    name: 'Отталкивание мышью',
    params: { radius: [0.5, 0.1, 1], strength: [0.5, 0, 2] },
    chunk: (id: string) => `
      vec2 d = uv - u_mouse;
      float dist = length(d);
      if(dist < u_mouse_pushRadius_${id}) uv += normalize(d) * (1.0 - dist / u_mouse_pushRadius_${id}) * u_mouse_pushStrength_${id};
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  mouse_glitch: {
    cat: 'mouse',
    name: 'Глитч мышью',
    params: { radius: [0.3, 0.1, 1], amt: [0.2, 0, 1] },
    chunk: (id: string) => `
      float d = distance(uv, u_mouse);
      if(d < u_mouse_glitchRadius_${id}) uv += vec2(hash(vec2(u_time*10.0, d)) - 0.5) * u_mouse_glitchAmt_${id};
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  mouse_fisheye: {
    cat: 'mouse',
    name: 'Рыбий глаз мышью',
    params: { radius: [0.5, 0.1, 1], power: [2, 0, 5] },
    chunk: (id: string) => `
      vec2 d = uv - u_mouse;
      float dist = length(d);
      if(dist < u_mouse_fisheyeRadius_${id}) uv = u_mouse + normalize(d) * pow(dist, u_mouse_fisheyePower_${id});
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  mouse_wave_color: {
    cat: 'mouse',
    name: 'Цветовая волна мышью',
    params: { radius: [0.5, 0.1, 1], speed: [2, 0, 10], mix: [1, 0, 1] },
    chunk: (id: string) => `
      vec2 d = uv - u_mouse;
      float dist = length(d);
      if(dist < u_mouse_wave_colorRadius_${id}) {
        float f = sin(u_time * u_mouse_wave_colorSpeed_${id} - dist*10.0);
        color = mix(color, vec3(f,f,f), u_mouse_wave_colorMix_${id});
      }
    `, // Меняет color, ок
  },
  mouse_rgb_shift: {
    cat: 'mouse',
    name: 'RGB смещение мышью',
    params: { radius: [0.5, 0.1, 1], amt: [0.05, 0, 0.3] },
    chunk: (id: string) => `
      vec2 d = uv - u_mouse;
      float dist = length(d);
      if(dist < u_mouse_rgbShiftRadius_${id}) {
        color.r = texture2D(u_texture, uv + vec2(u_mouse_rgbShiftAmt_${id},0)).r;
        color.g = texture2D(u_texture, uv).g;
        color.b = texture2D(u_texture, uv - vec2(u_mouse_rgbShiftAmt_${id},0)).b;
      }
    `, // Меняет color, ок
  },
  mouse_zoom: {
    cat: 'mouse',
    name: 'Зум мышью',
    params: { radius: [0.5, 0.1, 1], val: [1, 0.5, 3] },
    chunk: (id: string) => `
      float dist = distance(uv,u_mouse);
      if(dist < u_mouse_zoomRadius_${id}) uv = (uv-u_mouse)/u_mouse_zoomVal_${id}+u_mouse;
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  mouse_distort: {
    cat: 'mouse',
    name: 'Деформация мышью',
    params: { radius: [0.3, 0.1, 1], strength: [0.5, 0, 2] },
    chunk: (id: string) => `
      vec2 d = uv - u_mouse;
      float dist = length(d);
      if(dist < u_mouse_distortRadius_${id}) uv += normalize(d) * (u_mouse_distortRadius_${id}-dist) * u_mouse_distortStrength_${id};
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  mouse_spin: {
    cat: 'mouse',
    name: 'Вращение вокруг мыши',
    params: { radius: [0.3, 0.1, 1], speed: [1, 0, 10] },
    chunk: (id: string) => `
      vec2 d = uv - u_mouse;
      float dist = length(d);
      if(dist < u_mouse_spinRadius_${id}) {
        float a = u_time * u_mouse_spinSpeed_${id} * (1.0-dist/u_mouse_spinRadius_${id});
        uv = u_mouse + vec2(cos(a), sin(a)) * dist;
      }
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
  mouse_shake: {
    cat: 'mouse',
    name: 'Дрожь мышью',
    params: { radius: [0.3, 0.1, 1], amp: [0.05, 0, 0.5] },
    chunk: (id: string) => `
      float d = distance(uv,u_mouse);
      if(d < u_mouse_shakeRadius_${id}) uv += vec2(hash(vec2(u_time)) - 0.5, hash(vec2(u_time+1.0)) - 0.5) * u_mouse_shakeAmp_${id};
      color = texture2D(u_texture, uv).rgb;  // Фикс: обновляем color
    `,
  },
}
