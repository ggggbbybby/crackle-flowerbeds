import { createSVGWindow } from 'svgdom' ;
import { SVG, registerWindow, create } from '@svgdotjs/svg.js';

let colors;

// default colors. the user is allowed to override these per-request
// there's probably a better way to do this but global vars are easy
const resetColors = () => {
  colors = {
    'weft1': '#ffc20e',
    'weft2': '#ef1e24',
    'weft3': '#4d6df3',
    'warp': '#d3f9bc'
  }
}

const textureA = (canvas) => {
  canvas.rect(16,16).fill(colors.warp)
  // row 1 has weft1 spots
  canvas.rect(4,4).fill(colors.weft1).move(4,0)
  // row 2 has weft2 spots
  canvas.rect(4,4).fill(colors.weft2).move(12,4)
  // row 3 has weft3 floats
  canvas.rect(4,4).fill(colors.weft3).move(0,8)
  canvas.rect(8,4).fill(colors.weft3).move(8,8)
  // row 4 has weft2 spots again
  canvas.rect(4,4).fill(colors.weft2).move(12,12)
}
const textureB = (canvas) => {
  canvas.rect(16,16).fill(colors.warp)
  // row 1 has weft1 spots
  canvas.rect(4,4).fill(colors.weft1).move(12,0)
  // row 2 has weft2 floats
  canvas.rect(4,4).fill(colors.weft2).move(0,4)
  canvas.rect(8,4).fill(colors.weft2).move(8,4)
  // row 3 has weft3 floats
  canvas.rect(12,4).fill(colors.weft3).move(0,8)
  // row 4 has weft2 floats
  canvas.rect(4,4).fill(colors.weft2).move(0,12)
  canvas.rect(8,4).fill(colors.weft2).move(8,12)
}
const textureC = (canvas) => {
  canvas.rect(16,16).fill(colors.warp)
  // row 1 has weft1 floats
  canvas.rect(4,4).fill(colors.weft1)
  canvas.rect(8,4).fill(colors.weft1).move(8,0)
  // row 2 has weft2 floats
  canvas.rect(12,4).fill(colors.weft2).move(0,4)
  // row 3 has weft3 spots
  canvas.rect(4,4).fill(colors.weft3).move(4,8)
  // row 4 has weft2 floats
  canvas.rect(12,4).fill(colors.weft2).move(0,12)
}
const textureD = (canvas) => {
  canvas.rect(16,16).fill(colors.warp)
  // row 1 has weft1 floats
  canvas.rect(12,4).fill(colors.weft1)
  // row 2 has weft2 spots
  canvas.rect(4,4).fill(colors.weft2).move(4,4)
  // row 3 has weft3 spots
  canvas.rect(4,4).fill(colors.weft3).move(12,8)
  // row 4 has weft2 spots
  canvas.rect(4,4).fill(colors.weft2).move(4,12)
}

// this could be a function but I think objects are easier to read than 4 if statements stacked up wearing a trenchcoat
// there's probably a way to do this with math but again, not sure if that's much easier to read
// the first key is the threading block, the second is the treadling block (warp char then weft char)
const calculateTexture = {
  'A': { 'A': 'A', 'B': 'D', 'C': 'C', 'D': 'B' },
  'B': { 'A': 'B', 'B': 'A', 'C': 'D', 'D': 'C' },
  'C': { 'A': 'C', 'B': 'B', 'C': 'A', 'D': 'D' },
  'D': { 'A': 'D', 'B': 'C', 'C': 'B', 'D': 'A' },
}

const drawEverything = (canvas, seed) => {
  const seedSize = seed.length;
  canvas.size(seedSize * 64, seedSize * 64);

  const fills = {
    'A': canvas.pattern(16, 16, textureA),
    'B': canvas.pattern(16, 16, textureB),
    'C': canvas.pattern(16, 16, textureC),
    'D': canvas.pattern(16, 16, textureD)
  }
  seed.split('').forEach((weftChar, rowIdx, row) => {
    row.forEach((warpChar, threadIdx) => {
      const block = canvas.rect(64, 64)
      block.move(64 * threadIdx, 64 * rowIdx)
      const fill = calculateTexture[warpChar][weftChar];
      //console.log(`Warp #${threadIdx} (${warpChar}) X Weft #${rowIdx} (${weftChar}) = ${fill}`)

      block.fill(fills[fill])
    })
  })
  return canvas;
}

const flowerbedSVG = (seed, colorOverrides) => {
  // headless dom setup, important but boring 
  const window = createSVGWindow();
  const document = window.document;
  registerWindow(window, document);

  // initialize color palette & add any user overrides
  resetColors();
  Object.entries(colorOverrides).forEach(([key, color]) => {
    //console.log(`overriding ${key} with ${color}`)
    colors[key] = `#${color}`
  })

  // let's draw some flowers
  const canvas = SVG(document.documentElement);
  const svg = drawEverything(canvas, seed).svg();

  // remove any color overrides because otherwise we have to deal with state management and no thank you
  resetColors();
  return svg;
}
// pearl has a comment to add
// mhbddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd 
// thanks pearl

export default flowerbedSVG;
