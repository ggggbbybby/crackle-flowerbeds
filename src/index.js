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
app.get("/", (req, res) => {
  res.render("layout.html", { flowerbedSVG: flowerbedSVG() });
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});