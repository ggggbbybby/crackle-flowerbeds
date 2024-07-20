import { createSVGWindow } from 'svgdom' ;
import { SVG, registerWindow, create } from '@svgdotjs/svg.js';

const colors = { // ideally these would be configurable
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

const addBlocks = (canvas, profileString) => {
  const profileSize = profileString.length;
  canvas.size(profileSize * 64, profileSize * 64);

  // I don't know where else to create these patterns
  // but this seems like a strange place to do it
  // I guess this is the draw-everything function
  const fills = {
    'A': canvas.pattern(16, 16, textureA),
    'B': canvas.pattern(16, 16, textureB),
    'C': canvas.pattern(16, 16, textureC),
    'D': canvas.pattern(16, 16, textureD)
  }
  profileString.split('').forEach((char, idx, row) => {
    const block = canvas.rect(64, 64)
    block.move(64 * idx, 64 * idx)
    block.fill(fills[char])
  })

  return canvas;
}

const flowerbedSVG = () => {
  // headless dom setup, important but boring 
  const window = createSVGWindow();
  const document = window.document;
  registerWindow(window, document);

  // let's draw some flowers
  const canvas = SVG(document.documentElement)
  return addBlocks(canvas, 'ABBA').svg();
}
// pearl has a comment to add
// mhbddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd 
// thanks pearl

export default flowerbedSVG;
