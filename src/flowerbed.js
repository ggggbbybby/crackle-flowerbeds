import { createSVGWindow } from 'svgdom' ;
import { SVG, registerWindow, create } from '@svgdotjs/svg.js';

const colors = { 
  // ideally these would be configurable but I'm not sure how to do that with a server-rendered page
  // maybe I can pass alternate colors in via params
  'yellow': '#ffc20e',
  'red': '#ef1e24',
  'blue': '#4d6df3',
  'bg': '#d3f9bc'
}

const textureA = (canvas) => {
  canvas.rect(16,16).fill(colors.bg)
  // row 1
  canvas.rect(4,4).fill(colors.yellow).move(4,0)
  // row 2 has red spots
  canvas.rect(4,4).fill(colors.red).move(12,4)
  // row 3 has blue floats
  canvas.rect(4,4).fill(colors.blue).move(0,8)
  canvas.rect(8,4).fill(colors.blue).move(8,8)
  // row 4 has red spots again
  canvas.rect(4,4).fill(colors.red).move(12,12)
}
const textureB = (canvas) => {
  canvas.rect(16,16).fill(colors.bg)  
  // row 1 has yellow spots
  canvas.rect(4,4).fill(colors.yellow).move(12,0)
  // row 2 has red floats
  canvas.rect(4,4).fill(colors.red).move(0,4)
  canvas.rect(8,4).fill(colors.red).move(8,4)
  // row 3 has blue floats
  canvas.rect(12,4).fill(colors.blue).move(0,8)
  // row 4 has red floats
  canvas.rect(4,4).fill(colors.red).move(0,12)
  canvas.rect(8,4).fill(colors.red).move(8,12)
}
const textureC = (canvas) => {
  canvas.rect(16,16).fill(colors.bg)
  // row 1 has yellow floats
  canvas.rect(4,4).fill(colors.yellow)
  canvas.rect(8,4).fill(colors.yellow).move(8,0)
  // row 2 has red floats
  canvas.rect(12,4).fill(colors.red).move(0,4)
  // row 3 has blue spots
  canvas.rect(4,4).fill(colors.blue).move(4,8)
  // row 4 has red floats
  canvas.rect(12,4).fill(colors.red).move(0,12)
}
const textureD = (canvas) => {
  canvas.rect(16,16).fill(colors.bg)
  // row 1 has yellow floats
  canvas.rect(12,4).fill(colors.yellow)
  // row 2 has red spots
  canvas.rect(4,4).fill(colors.red).move(4,4)
  // row 3 has blue spots
  canvas.rect(4,4).fill(colors.blue).move(12,8)
  // row 4 has red spots
  canvas.rect(4,4).fill(colors.red).move(4,12)
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
  seedString.split('').forEach((weftChar, rowIdx, row) => {
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

const flowerbedSVG = (seed) => {
  // headless dom setup, important but boring 
  const window = createSVGWindow();
  const document = window.document;
  registerWindow(window, document);

  // let's draw some flowers
  const canvas = SVG(document.documentElement)
  return drawEverything(canvas, seed).svg();
}
// pearl has a comment to add
// mhbddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd 
// thanks pearl

export default flowerbedSVG;
