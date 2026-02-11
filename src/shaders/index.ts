import { ART } from '@/shaders/art.ts'
import { COLOR } from '@/shaders/color.ts'
import { DISTORT } from '@/shaders/distort.ts'
import { GEO } from '@/shaders/geo.ts'
import { MOUSE } from '@/shaders/mouse.ts'
import { RETRO } from '@/shaders/retro.ts'
import { TECH } from '@/shaders/tech.ts'

export const EFFECTS_LIB = {
  ...ART,
  ...COLOR,
  ...DISTORT,
  ...GEO,
  ...MOUSE,
  ...RETRO,
  ...TECH,
}
