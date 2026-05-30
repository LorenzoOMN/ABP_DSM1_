"use strict";

const assert = require("assert");
const fs = require("fs");

const ejsFile = "public/pages/capitulo4.ejs";
const cssFile = "public/assets/css/capitulo4.css";
const ejs = fs.readFileSync(ejsFile, "utf8");
const css = fs.readFileSync(cssFile, "utf8");

assert.match(ejs, /id="cena-ampulheta"[^>]*class="[^"]*immersive-scene/);
assert.match(ejs, /class="scene-atmosphere"[^>]*aria-hidden="true"/);
assert.match(ejs, /class="scene-impact"/);
assert.match(ejs, /id="btnExaminarAmpulheta"/);
assert.match(ejs, /id="ampulhetaEstado"/);
assert.match(ejs, /A areia permanece presa entre dois instantes/);
assert.match(ejs, /fluxo precisa ser visto/);

assert.match(css, /\.immersive-scene/);
assert.match(css, /\.scene-atmosphere/);
assert.match(css, /\.scene-impact/);
assert.match(css, /\.hourglass-relic/);
