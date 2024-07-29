import { createSVGWindow } from 'svgdom' ;
import { SVG, registerWindow, create } from '@svgdotjs/svg.js';

const pixelSize = 1;
// why??? because autocomplete is easier this way
const pixelSizeX2 = pixelSize * 2;
const pixelSizeX3 = pixelSize * 3;
const pixelSizeX4 = pixelSize * 4;
const pixelSizeX16 = pixelSize * 16;

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
  canvas.rect(pixelSizeX4, pixelSizeX4).fill(colors.warp)
  // row 1 has weft1 spots
  canvas.rect(pixelSize, pixelSize).fill(colors.weft1).move(pixelSize, 0)
  // row 2 has weft2 spots
  canvas.rect(pixelSize, pixelSize).fill(colors.weft2).move(pixelSizeX3, pixelSize)
  // row 3 has weft3 floats
  canvas.rect(pixelSize, pixelSize).fill(colors.weft3).move(0, pixelSizeX2)
  canvas.rect(pixelSizeX2, pixelSize).fill(colors.weft3).move(pixelSizeX2, pixelSizeX2)
  // row 4 has weft2 spots again
  canvas.rect(pixelSize, pixelSize).fill(colors.weft2).move(pixelSizeX3, pixelSizeX3)
}
const textureB = (canvas) => {
  canvas.rect(pixelSizeX4, pixelSizeX4).fill(colors.warp)
  // row 1 has weft1 spots
  canvas.rect(pixelSize, pixelSize).fill(colors.weft1).move(pixelSizeX3, 0)
  // row 2 has weft2 floats
  canvas.rect(pixelSize, pixelSize).fill(colors.weft2).move(0, pixelSize)
  canvas.rect(pixelSizeX2, pixelSize).fill(colors.weft2).move(pixelSizeX2, pixelSize)
  // row 3 has weft3 floats
  canvas.rect(pixelSizeX3, pixelSize).fill(colors.weft3).move(0, pixelSizeX2)
  // row 4 has weft2 floats
  canvas.rect(pixelSize, pixelSize).fill(colors.weft2).move(0, pixelSizeX3)
  canvas.rect(pixelSizeX2, pixelSize).fill(colors.weft2).move(pixelSizeX2, pixelSizeX3)
}
const textureC = (canvas) => {
  canvas.rect(pixelSizeX4, pixelSizeX4).fill(colors.warp)
  // row 1 has weft1 floats
  canvas.rect(pixelSize, pixelSize).fill(colors.weft1)
  canvas.rect(pixelSizeX2, pixelSize).fill(colors.weft1).move(pixelSizeX2, 0)
  // row 2 has weft2 floats
  canvas.rect(pixelSizeX3, pixelSize).fill(colors.weft2).move(0, pixelSize)
  // row 3 has weft3 spots
  canvas.rect(pixelSize, pixelSize).fill(colors.weft3).move(pixelSize, pixelSizeX2)
  // row 4 has weft2 floats
  canvas.rect(pixelSizeX3, pixelSize).fill(colors.weft2).move(0, pixelSizeX3)
}
const textureD = (canvas) => {
  canvas.rect(pixelSizeX4, pixelSizeX4).fill(colors.warp)
  // row 1 has weft1 floats
  canvas.rect(pixelSizeX3, pixelSize).fill(colors.weft1)
  // row 2 has weft2 spots
  canvas.rect(pixelSize, pixelSize).fill(colors.weft2).move(pixelSize, pixelSize)
  // row 3 has weft3 spots
  canvas.rect(pixelSize, pixelSize).fill(colors.weft3).move(pixelSizeX3, pixelSizeX2)
  // row 4 has weft2 spots
  canvas.rect(pixelSize, pixelSize).fill(colors.weft2).move(pixelSize, pixelSizeX3)
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

const drawRectangle = (canvas, warp, weft) => {
  if (!weft) { weft = warp }
  canvas.size(warp.length * pixelSizeX16, weft.length * pixelSizeX16);

  const fills = {
    'A': canvas.pattern(pixelSizeX4, pixelSizeX4, textureA),
    'B': canvas.pattern(pixelSizeX4, pixelSizeX4, textureB),
    'C': canvas.pattern(pixelSizeX4, pixelSizeX4, textureC),
    'D': canvas.pattern(pixelSizeX4, pixelSizeX4, textureD)
  }
  weft.split('').forEach((weftChar, rowIdx) => {
    warp.split('').forEach((warpChar, threadIdx) => {
      const block = canvas.rect(pixelSizeX16, pixelSizeX16)
      block.move(pixelSizeX16 * threadIdx, pixelSizeX16 * rowIdx)
      const fill = calculateTexture[warpChar][weftChar];
      //console.log(`Warp #${threadIdx} (${warpChar}) X Weft #${rowIdx} (${weftChar}) = ${fill}`)

      block.fill(fills[fill])
    })
  })
  return canvas;
}

const flowerbedSVG = (seeds, colorOverrides = {}) => {
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
  const svg = drawRectangle(canvas, ...seeds).svg();

  // remove any color overrides because otherwise we have to deal with state management and no thank you
  resetColors();
  return svg;
}
// pearl has a comment to add
// mhbddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd 
// thanks pearl

export default flowerbedSVG;
