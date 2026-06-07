"use strict";

const assert = require("assert");
const fs = require("fs");

const ejsFile = "public/pages/capitulo4.ejs";
const cssFile = "public/assets/css/capitulo4.css";
const jsFile = "public/assets/js/capitulo4.js";
const ejs = fs.readFileSync(ejsFile, "utf8");
const css = fs.readFileSync(cssFile, "utf8");
const js = fs.readFileSync(jsFile, "utf8");

assert.match(ejs, /id="capitulo4IntroNarrativa"/);
assert.match(ejs, /id="introScrollSpace"/);
assert.match(ejs, /id="introPrelude"/);
assert.match(ejs, /id="introHourglassImage"/);
assert.match(ejs, /id="introLines"/);
assert.match(ejs, /id="introScrollHint"/);
assert.match(ejs, /Role para continuar/);
assert.match(ejs, /\/assets\/img\/capitulo_4\/ampulheta-travada-pixel-transparente\.png/);
assert.match(ejs, /data-scroll-to-hourglass/);
assert.doesNotMatch(ejs, /data-scroll-offset/);
assert.match(css, /\.intro-scroll-hint/);
assert.match(css, /\.capitulo4-intro\.show-scroll-hint \.intro-scroll-hint/);
assert.match(js, /INTRO_SCROLL_HINT_DELAY\s*=\s*2000/);
assert.match(js, /window\.addEventListener\("scroll", agendarLegendaScrollIntro/);
assert.doesNotMatch(js, /window\.addEventListener\("wheel", agendarLegendaScrollIntro/);
assert.doesNotMatch(js, /window\.addEventListener\("touchstart", agendarLegendaScrollIntro/);
assert.doesNotMatch(js, /window\.addEventListener\("pointerdown", agendarLegendaScrollIntro/);
assert.doesNotMatch(js, /window\.addEventListener\("keydown", agendarLegendaScrollIntro/);
