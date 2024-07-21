import express from 'express';
import { renderFile } from 'ejs';

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
  const seed = 'ABCDCBA';
  res.render("layout.html", { seed: seed, flowerbedSVG: flowerbedSVG(seed, req.query) });
})

// same thing as above but with the seed in the URL (ie a permalink)
app.get("/:seed([ABCD]+)", (req, res) => {
  res.render("layout.html", { seed: req.params.seed, flowerbedSVG: flowerbedSVG(req.params.seed.toUpperCase(), req.query) });
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});