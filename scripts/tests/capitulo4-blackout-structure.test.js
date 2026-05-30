"use strict";

const assert = require("assert");
const fs = require("fs");

const ejsFile = "public/pages/capitulo4.ejs";
const cssFile = "public/assets/css/capitulo4.css";

const ejs = fs.readFileSync(ejsFile, "utf8");
const css = fs.readFileSync(cssFile, "utf8");

assert.match(
  ejs,
  /<div class="viewport-blackout" id="viewportBlackout" aria-hidden="true"><\/div>/,
);

assert.doesNotMatch(
  ejs,
  /<div class="hero-blackout" id="heroBlackout" aria-hidden="true"><\/div>/,
);

assert.match(
  css,
  /\.viewport-blackout\s*\{[\s\S]*position:\s*fixed;[\s\S]*inset:\s*0;[\s\S]*background:\s*#000;[\s\S]*pointer-events:\s*none;[\s\S]*\}/,
);
