"use strict";

const assert = require("assert");
const fs = require("fs");

const ejs = fs.readFileSync("public/pages/capitulo4.ejs", "utf8");
const css = fs.readFileSync("public/assets/css/capitulo4.css", "utf8");
const js = fs.readFileSync("public/assets/js/capitulo4.js", "utf8");

assert.match(ejs, /id="cena-forja"[^>]*data-locked-by="kanban"/);
assert.match(ejs, /id="cena-ponte"[^>]*data-locked-by="dod"/);
assert.strictEqual((ejs.match(/class="scene-lock"/g) || []).length, 2);
assert.strictEqual((ejs.match(/<strong>Bloqueado<\/strong>/g) || []).length, 2);
assert.doesNotMatch(ejs, /Cadeado da hist.ria/);
assert.match(ejs, /Conclua o Kanban para liberar a Porta da DoD/);
assert.match(ejs, /Conclua a Porta da DoD para liberar o pr.ximo trecho/);

assert.match(css, /\.story-block\.is-locked/);
assert.match(css, /\.story-block\.is-locked > :not\(\.scene-lock\)/);
assert.match(css, /\.scene-lock/);
assert.match(css, /\.scene-lock__icon/);
assert.match(css, /\.scene-lock__icon::before/);
assert.match(css, /\.scene-lock__icon::after/);
assert.match(css, /\.progress-item--locked/);

assert.match(js, /const completedMinigames = new Set/);
assert.match(js, /function configurarBloqueiosHistoria/);
assert.match(js, /function concluirMinigame/);
assert.match(js, /data-locked-by/);
assert.match(js, /is-locked/);
assert.match(js, /progress-item--locked/);
assert.match(js, /concluirMinigame\("kanban"\)/);
assert.match(js, /concluirMinigame\("dod",\s*\{\s*scrollTo: "#cena-ponte"\s*\}\)/);
