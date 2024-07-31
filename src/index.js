import express from 'express';
import { renderFile } from 'ejs';
import { createHash } from 'crypto';

import wiggle from './wiggle.js';
import flowerbedSVG from './flowerbed.js';
import generateWIF from './wif.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 4242 //process.env.PORT;

app.use(express.static('public'));
app.set("view engine", "html");
app.engine('html', renderFile);

// render a generated flowerbed svg
// not guaranteed to give you the same thing every time
app.get("/", (req, res) => {
  const warp = wiggle(4);
  const weft = wiggle(6);
  res.render("layout.html", { seed: `${warp}/${weft}`, flowerbedSVG: flowerbedSVG([warp, weft], req.query) });
})

// given a warp profile, generate a weft profile to go with it
app.get("/:warp([ABCD]+)", (req, res) => {
  const weft = wiggle(5);
  res.render(
    "layout.html", 
    { 
      seed: `${req.params.warp}/${weft}`, 
      flowerbedSVG: flowerbedSVG([req.params.warp.toUpperCase(), weft], req.query) 
    }
  );
})

app.get("/:warp([ABCD]+)/:weft([ABCD]+)", (req, res) => {
  const { warp, weft } = req.params;
  res.render(
    "layout.html", 
    { 
      seed: `${warp}/${weft}`, 
      flowerbedSVG: flowerbedSVG([warp.toUpperCase(), weft.toUpperCase()], req.query) 
    }
  );
})

app.get("/:warp([ABCD]+)/:weft([ABCD]+).wif", (req, res) => {
  const wif = generateWIF(Array.from(req.params.warp.toUpperCase()), Array.from(req.params.weft.toUpperCase()))
  const filename = createHash('md5').update(wif).digest('hex')
  res.set({"Content-Disposition": `attachment; filename="crackle-profile-${filename}.wif"`})
  res.set({"Content-type": "text/plain"})
  res.send(wif)
})

app.get("/bangbang", (req, res) => {
  res.render(
    "bangbang.html",
    {
      background: flowerbedSVG([wiggle(10)])
    }
  )
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});