"use strict";

const assert = require("assert");
const fs = require("fs");

const ejsFile = "public/pages/capitulo4.ejs";
const ejs = fs.readFileSync(ejsFile, "utf8");

assert.match(ejs, /id="capitulo4IntroNarrativa"/);
assert.match(ejs, /id="introScrollSpace"/);
assert.match(ejs, /id="introPrelude"/);
assert.match(ejs, /id="introHourglassImage"/);
assert.match(ejs, /id="introLines"/);
assert.match(ejs, /\/assets\/img\/capitulo_4\/ampulheta-travada-pixel-transparente\.png/);
assert.match(ejs, /data-scroll-to="#introScrollSpace"/);
