// what even is a WIF? it stands for Weaving Information File
// it's the pdf of weaving patterns

// it's a text file that encodes the threading, treadling, tie-up, 
// and any other information a computer needs to render a weaving pattern.

// this wif only includes the basics, no color or yarn specifications or anything fancy.

const blockKeys = {'A': 1, 'B': 2, 'C': 3, 'D': 4 };
const threadingSequence = (warp) => {
  return warp.map((block, idx) => `${idx+1}=${blockKeys[block]}`)
}

const treadlingSequence = (weft) => {
  return weft.map((block, idx) => `${idx+1}=${blockKeys[block]}`)
}

const generateWIF = (warp, weft) => {
  const today = new Date().toDateString();
  const title = "Algorithmically Generated Crackle Flowerbed"

  return [
    "",
    "[WIF]",
    "[Version=1.1]",
    `Date=${today}`,
    "Developers=ggggbbybby@gmail.com",
    "Source Program=bangbang-crackle-flowerbeds",
    "Source Version=1",
    "",
    "[CONTENTS]",
    "TEXT=true",
    "WEAVING=true",
    "WARP=true",
    "WEFT=true",    
    "THREADING=true",
    "TIEUP=true",
    "TREADLING=true",
    "",
    "[TEXT]",
    `Title=${title}`,
    "",
    "[THREADING]",
    ...threadingSequence(warp),
    "",
    "[TIEUP]",
    "1=1,2",
    "2=2,3",
    "3=3,4",
    "4=1,4",
    "",
    "[TREADLING]",
    ...treadlingSequence(weft),
    "",
    "[WEAVING]",
    "Rising Shed=false",
    `Shafts=4`,
    `Treadles=4`,
    "",
    "[WARP]",
    "Units=centimeters",
    "Color=1",
    `Threads=${warp.length}`,
    "Spacing=0.2117",
    "Thickness=0.2117",
    "",
    "[WEFT]",
    "Units=centimeters",
    "Color=2",
    `Threads=${weft.length}`,
    "Spacing=0.2117",
    "Thickness=0.2117"
  ].join("\n")
}

export default generateWIF;