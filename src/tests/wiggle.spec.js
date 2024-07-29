import { expect } from 'chai';
import { line, point, wave, d6, linePointLine } from '../wiggle.js';

describe("lines", () => {
  it("generates an empty line", () => {
    expect(line('A', 0).join('')).to.equal('')
  })

  it("generates an ascending line from A to D", () => {
    expect(line().join('')).to.equal("ABCD")
    expect(line('A', 8).join('')).to.equal("ABCDABCD")
  })

  it("generates an ascending line from A to D", () => {
    expect(line('D', 2).join('')).to.equal("DA")
    expect(line('D', 5).join('')).to.equal("DABCD")
  })

  it("generates a descending line from A to D", () => {
    expect(line('A', 2, false).join('')).to.equal("AD")
    expect(line('A', 5, false).join('')).to.equal("ADCBA")
  })

  it("generates a descending line from D to A", () => {
    expect(line('D', 4, false).join('')).to.equal("DCBA")
    expect(line('D', 8, false).join('')).to.equal("DCBADCBA")
  })
});

describe("points", () => {
  it("generates an empty point", () => {
    expect(point('A', 0).join('')).to.equal('')
  })

  it("generates a right point", () => {
    expect(point().join('')).to.equal("ABCDCBA")
    expect(point('C', 3).join('')).to.equal("CDADC")
    expect(point('A', 7).join('')).to.equal("ABCDABCBADCBA")
  })

  it("generates a left point", () => {
    expect(point('D', 4, false).join('')).to.equal("DCBABCD")
    expect(point('D', 2, false).join('')).to.equal("DCD")
    expect(point('B', 7, false).join('')).to.equal("BADCBADABCDAB")
  });
});

describe("waves", () => {
  it("generates an empty wave", () => {
    expect(wave([]).join('')).to.equal('');
  })

  it("generates a symmetric wave", () => {
    // two sequential points should mirror
    const sine = [{type: 'point', width: 2}, {type: 'point', width: 2}]
    expect(wave(sine).join('')).to.equal("ABADCD")
  })

  it("generates a continuous line", () => {
    // two sequential lines should be the same as a line with the lengths added together
    const line = [{type: 'line', width: 3}, {type: 'line', width: 5}]
    expect(wave(line).join('')).to.equal("ABCDABCD")
  })

  // let's make sure we can generate some standard twill shapes with this algorithm

  it("generates point twill", () => {
    // point twill is made of repeating points that all go in the same direction
    /*
              D           D
            C   C       C   C
          B       B   B       B
        A           A           A
    */
    const pointTwill = [
      {type: 'line', width: 2},  // AB
      {type: 'point', width: 2}, // CDC
      {type: 'point', width: 2}, // BAB
      {type: 'point', width: 2}, // CDC
      {type: 'line', width: 2}   // BA
    ]
    expect(wave(pointTwill).join('')).to.equal("AB" + "CDC" + "BAB" + "CDC" + "BA")
  })

  it("generates wall of troy", () => {
    // wall of troy is an asymmetric point twill that looks like a sideways Z
    /*
            D           D
          C   C       C
        B       B   B
      A           A
    */
   const wallOfTroy = [
    {type: 'line', width: 2},  // AB
    {type: 'point', width: 2}, // CDC
    {type: 'point', width: 2}, // BAB
    {type: 'line', width: 2},  // CD
   ];
   expect(wave(wallOfTroy).join('')).to.equal("ABCDCBA" + "BCD")
  })

  it("generates Ms and Ws", () => {
    // Ms & Ws is a point sequence that looks like an M and a W
    /*
              D       D       D                   D
            C   C   C   C       C       C       C
          B       B       B       B   B   B   B
        A                   A       A       A
    */
   const msAndWs = [
    {type: 'line', width: 2},  // AB
    {type: 'point', width: 2}, // CDC
    {type: 'point', width: 1}, // B
    {type: 'point', width: 2}, // CDC
    {type: 'line', width: 4},  // BADC
    {type: 'point', width: 2}, // BAB
    {type: 'point', width: 1}, // C
    {type: 'point', width: 2}, // BAB
    {type: 'line', width: 2},  // CD
   ]
   expect(wave(msAndWs).join("")).to.equal("ABCDCBCDCBA" + "DCBABCBABCD")
  })

  it("generates advancing twill", () => {
    // advancing twill is a point sequence with points that all go in the same direction, 
    // but the starting point shifts by one each time
    /*
                    D       D   D   D      D
          C       C   C   C       C
        B   B   B       B               B
      A       A               A       A   A
    */
    const advancingTwill = [
      {type: 'line', width: 1},  // A
      {type: 'point', width: 2}, // BCB
      {type: 'point', width: 1}, // A
      {type: 'line', width: 1},  // B
      {type: 'point', width: 2}, // CDC
      {type: 'point', width: 1}, // B    
      {type: 'line', width: 1},  // C
      {type: 'point', width: 2}, // DAD
      {type: 'point', width: 1}, // C
      {type: 'line', width: 1},  // D
      {type: 'point', width: 2}, // ABA
      {type: 'point', width: 1}, // D      
    ]
    expect(wave(advancingTwill).join("")).to.equal("ABCBA" + "BCDCB" + "CDADC" + "DABAD")
  })
})

describe("d6", () => {
  it("generates a number between 1 and 6", () => {
    expect(d6()).to.be.within(1, 6)
  })
})

describe("linePointLine", () => {
  it("generates the default number of points", () => {
    const instructions = linePointLine()
    expect(instructions.length).to.eq(3)

    expect(instructions[0].type).to.eq('line')
    expect(instructions[0].width).to.be.within(1, 6)

    expect(instructions[1].type).to.eq('point')
    expect(instructions[1].width).to.be.within(1, 6)

    expect(instructions[2].type).to.eq('line')
    expect(instructions[2].width).to.be.within(1, 6)
  })
})