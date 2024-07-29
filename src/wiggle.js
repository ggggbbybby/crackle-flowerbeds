import last from 'lodash/last.js';
import sample from 'lodash/sample.js';

const alphabet = ['A', 'B', 'C', 'D'];
const nextChar = (x) => alphabet[ (alphabet.indexOf(x) + 1) % alphabet.length ];
const prevChar = (x) => alphabet[ (alphabet.indexOf(x) + 3) % alphabet.length ];

export const line = (startingChar = 'A', length = 4, asc = true) => {
  let out = [];
  let currLength = out.length;
  let char = startingChar;

  while (currLength < length) {
    out.push(char)
    currLength += 1
    char = asc ? nextChar(char) : prevChar(char)
  }
  return out;
}

export const point = (startingChar = 'A', width = 4, asc = true) => {
  // a point is two lines that meet in the middle, like ABCDCBA
  const leg1 = line(startingChar, width, asc) // ABCD
  const leg2 = line(leg1[width - 2], width - 1, !asc) // CBA

  return leg1.concat(leg2)
}

export const wave = (instructions, startingChar = 'A', asc = true) => {
  // a wave is made of continuous lines and points that alternate directions
  // each instruction is either a line or a point, with a specified width
  let char = startingChar
  let dir = asc
  return instructions.reduce((memo, {type, width}) => {
    const segment = type == 'point' ? point(char, width, dir) : line(char, width, dir)

    // the next starting char is going to be one past the end of this segment
    // if it was a point, we changed directions at the point. if it was a line, we didn't change direction.
    if (type === 'point') dir = !dir
    char = dir ? nextChar(last(segment)) : prevChar(last(segment))

    return memo.concat(segment)
  }, [])
}

export const d4 = () => sample([1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 5]) // lmao
export const d6 = () => sample([1, 2, 3, 4, 5, 6]) 

export const linePointLine = (pointCount = 1) => {
  // create a set of instructions to generate a wave with random segment lengths
  let points = 0
  let out = [{ type: 'line', width: d4() }]
  
  while (points < pointCount) {
    out.push({ type: 'point', width: d4() })
    out.push({ type: 'line', width: d4() })
    points++
  }

  return out;
}

const wiggle = (pointCount = 4) => {
  // a wiggle is a wave that's been stretched to sharpen or flatten some of the points
  const instructions = linePointLine(pointCount)
  const blocks = wave(instructions, sample(alphabet))
  const stretches = blocks.flatMap((block) => Array(d4()).fill(block))

  return stretches.join('')
}

export default wiggle;