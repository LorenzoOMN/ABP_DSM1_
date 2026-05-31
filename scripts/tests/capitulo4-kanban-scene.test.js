"use strict";

const assert = require("assert");
const fs = require("fs");

const ejs = fs.readFileSync("public/pages/capitulo4.ejs", "utf8");
const css = fs.readFileSync("public/assets/css/capitulo4.css", "utf8");
const js = fs.readFileSync("public/assets/js/capitulo4.js", "utf8");

assert.match(ejs, /id="cena-kanban"/);
assert.match(ejs, /O Quadro das Tarefas Presas/);
assert.match(ejs, /Isto . um quadro Kanban/);
assert.match(ejs, /N.o confundam muitas tarefas iniciadas com progresso/);
assert.match(ejs, /Come.ar menos pode ser o caminho para terminar mais/);

assert.match(ejs, /class="kanban-board"/);
assert.match(ejs, /data-column="todo"/);
assert.match(ejs, /data-column="doing"[^>]*data-wip-limit="2"/);
assert.match(ejs, /data-column="test"/);
assert.match(ejs, /data-column="done"/);
assert.match(ejs, /data-wip-counter/);
assert.match(ejs, /id="kanbanStatus"/);
assert.match(ejs, /class="[^"]*kanban-card/);
assert.match(ejs, /data-kanban-card/);

assert.match(css, /\.kanban-board/);
assert.match(css, /\.kanban-column/);
assert.match(css, /\.kanban-card/);
assert.match(css, /\.kanban-column--over-limit/);
assert.match(css, /\.kanban-status/);

assert.match(js, /function atualizarKanban/);
assert.match(js, /function configurarKanban/);
assert.match(js, /kanbanStatus/);
