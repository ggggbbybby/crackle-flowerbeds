import express from 'express';
import { renderFile } from 'ejs';

import wiggle from './wiggle.js';
import flowerbedSVG from './flowerbed.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.static('public'));
app.set("view engine", "html");
app.engine('html', renderFile);

// render a generated flowerbed svg
// not guaranteed to give you the same thing every time
app.get("/", (req, res) => {
  const warp = wiggle(3);
  const weft = wiggle(5);
  res.render("layout.html", { seed: `${warp}/${weft}`, flowerbedSVG: flowerbedSVG([warp, weft], req.query) });
})

// same thing as above but with the seed in the URL (ie a permalink)
app.get("/:seed([ABCD]+)", (req, res) => {
  res.render(
    "layout.html", 
    { 
      seed: req.params.seed, 
      flowerbedSVG: flowerbedSVG([req.params.seed.toUpperCase()], req.query) 
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