import last from 'lodash/last.js';

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

export const wave = (chunks, startingChar = 'A', asc = true) => {
  // a wave is made of continuous lines and points that alternate directions
  // each chunk is either a line or a point, with a specified width
  let char = startingChar
  let dir = asc
  return chunks.reduce((memo, {type, width}) => {
    const segment = type == 'point' ? point(char, width, dir) : line(char, width, dir)

    // the next starting char is going to be one past the end of this segment
    // if it was a point, we changed directions at the point. if it was a line, we didn't change direction.
    if (type === 'point') dir = !dir
    char = dir ? nextChar(last(segment)) : prevChar(last(segment))

    return memo.concat(segment)
  }, []);
}

const wiggle = () => {
  // a wiggle is a wave that's been stretched to sharpen or flatten some of the points
  // todo: write this

  return "ABCBADCBABCD";
}

export default wiggle;