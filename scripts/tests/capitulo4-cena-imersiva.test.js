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
assert.doesNotMatch(ejs, /id="btnExaminarAmpulheta"/);
assert.doesNotMatch(ejs, /id="ampulhetaEstado"/);
assert.doesNotMatch(ejs, /<p class="scene-impact">\s*A terceira porta ficou para tr.s\.\s*<\/p>/);
assert.doesNotMatch(ejs, /A Ampulheta da Sprint foi conquistada, mas a areia n.o cai/);
assert.match(ejs, /A Sprint existe, mas a areia n.o cai/);
assert.match(ejs, /Depois da terceira porta, o grupo ainda est. no p.ntano nebuloso/);
assert.match(ejs, /A Ampulheta da Sprint\s+flutua no centro do caminho/);
assert.match(ejs, /Product Backlog e o Sprint Backlog se abrem no ch.o/);
assert.match(ejs, /As tarefas brilham como marcas de luz/);
assert.match(ejs, /algumas avan.am, outras piscam, outras ficam presas/);
assert.match(ejs, /uma Sprint . um ciclo de trabalho/);
assert.match(ejs, /ciclo saud.vel precisa de foco, fluxo e entrega de valor/);
assert.match(ejs, /Trabalho iniciado n.o . trabalho conclu.do/);
assert.match(ejs, /A Sprint s. respira quando o trabalho flui/);
assert.match(ejs, /data-corvo-hover="Trabalho iniciado n.o . trabalho conclu.do\."/);

assert.match(css, /\.immersive-scene/);
assert.match(css, /\.scene-atmosphere/);
assert.match(css, /\.scene-impact/);
assert.match(css, /\.hourglass-hover/);
assert.match(css, /\.hourglass-hover::after/);
