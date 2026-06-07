"use strict";

const assert = require("assert");
const fs = require("fs");

const css = fs.readFileSync("public/assets/css/capitulo4.css", "utf8");
const js = fs.readFileSync("public/assets/js/capitulo4.js", "utf8");

assert.match(css, /\.pipeline-neon-board\s*\{[\s\S]*grid-template-rows:\s*repeat\(3/);
assert.match(css, /\.pipeline-neon-step\s*\{[\s\S]*grid-column:\s*var\(--slot-col\);[\s\S]*grid-row:\s*var\(--slot-row\)/);
assert.match(js, /function shuffleItems\(items\)/);
assert.match(js, /function setPipelineRandomLayout\(\)/);
assert.match(js, /typeof window\.matchMedia === "function"[\s\S]*window\.matchMedia\("\(max-width: 768px\)"\)\.matches/);
assert.match(js, /button\.style\.setProperty\("--slot-col", String\(slotColumn\)\)/);
assert.match(js, /button\.style\.setProperty\("--assemble-x", `\$\{assembleX\}%`\)/);
assert.match(js, /button\.style\.setProperty\("--piece-rot", "0deg"\)/);
assert.match(js, /button\.style\.setProperty\("--assemble-rot", "0deg"\)/);
assert.doesNotMatch(js, /rot:\s*"[-0-9]+deg"/);

assert.match(css, /\.pipeline-neon-step::before\s*\{[\s\S]*rgba\(255,\s*255,\s*255,\s*0\.18\)[\s\S]*opacity:\s*0\.22/);
assert.match(css, /\.pipeline-neon-icon\s*\{[\s\S]*brightness\(0\.86\)[\s\S]*drop-shadow\(0 0 10px rgba\(255,\s*255,\s*255,\s*0\.16\)\)[\s\S]*opacity:\s*0\.84/);
assert.match(css, /\.pipeline-neon-board--ready \.pipeline-neon-step\s*\{[\s\S]*pipeline-piece-enter/);
assert.match(css, /\.pipeline-neon-step\.pipeline-action--press\s*\{[\s\S]*pipeline-click-confirm/);
assert.match(css, /\.pipeline-neon-step\.pipeline-action--correct\s*\{[\s\S]*pipeline-correct-confirm/);
assert.match(css, /@keyframes pipeline-shake\s*\{[\s\S]*translate:\s*0 0;[\s\S]*translate:\s*-0\.32rem 0;[\s\S]*translate:\s*0\.32rem 0;[\s\S]*translate:\s*0 0;/);
assert.doesNotMatch(css.match(/@keyframes pipeline-shake\s*\{[\s\S]*?\n\}/)[0], /transform:/);
assert.match(css, /@keyframes pipeline-action-wrong\s*\{[\s\S]*translate\(var\(--piece-x\), var\(--piece-y\)\) rotate\(var\(--piece-rot\)\)[\s\S]*translate\(calc\(var\(--piece-x\) - 0\.18rem\), var\(--piece-y\)\)[\s\S]*translate\(calc\(var\(--piece-x\) \+ 0\.18rem\), var\(--piece-y\)\)/);
assert.match(css, /\.pipeline-void\.pipeline-panel--complete \.pipeline-neon-step\s*\{[\s\S]*--step-glow:\s*118,\s*255,\s*126/);
assert.match(css, /animation:\s*pipeline-bridge-assemble 1\.15s[\s\S]*pipeline-green-shine 1\.8s/);
assert.match(css, /@keyframes pipeline-piece-enter/);
assert.match(css, /@keyframes pipeline-click-confirm/);
assert.match(css, /@keyframes pipeline-correct-confirm/);
assert.match(css, /@keyframes pipeline-bridge-assemble/);
assert.match(css, /@keyframes pipeline-green-shine/);

assert.match(css, /\.pipeline-void\.pipeline-panel--complete \.pipeline-neon-step:nth-child\(1\)\s*\{[\s\S]*grid-column:\s*1/);
assert.match(css, /\.pipeline-void\.pipeline-panel--complete \.pipeline-neon-step:nth-child\(5\)\s*\{[\s\S]*grid-column:\s*5/);
assert.match(css, /@media \(max-width: 768px\)\s*\{[\s\S]*\.pipeline-void\.pipeline-panel--complete \.pipeline-neon-board\s*\{[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\);[\s\S]*grid-template-rows:\s*repeat\(5, minmax\(4\.2rem, auto\)\)/);
assert.match(css, /@media \(max-width: 768px\)\s*\{[\s\S]*\.pipeline-void\.pipeline-panel--complete \.pipeline-neon-step:nth-child\(1\)\s*\{[\s\S]*grid-row:\s*1;[\s\S]*\.pipeline-void\.pipeline-panel--complete \.pipeline-neon-step:nth-child\(5\)\s*\{[\s\S]*grid-row:\s*5;/);
assert.doesNotMatch(css, /--assemble-rot:\s*-[0-9]+deg|--assemble-rot:\s*[1-9][0-9]*deg/);
assert.match(css, /translate\(var\(--assemble-x\), var\(--assemble-y\)\)/);
assert.match(js, /button\.classList\.add\("pipeline-action--press"\)/);
assert.match(js, /button\.classList\.add\("pipeline-action--correct"\)/);
assert.match(js, /window\.setTimeout\(\(\) => \{[\s\S]*panel\.classList\.remove\("pipeline-panel--shake"\);[\s\S]*\}, 620\);/);
assert.match(js, /if \(!expectedStep \|\| selectedStep !== expectedStep\.id\) \{[\s\S]*shakeBridge\(button\);[\s\S]*return;\s*\}[\s\S]*button\.classList\.add\("pipeline-action--press"\)/);
assert.match(js, /window\.setTimeout\(\(\)\s*=>\s*\{[\s\S]*concluirMinigame\("pipeline",\s*\{\s*scrollTo:\s*"#cena-divida"\s*\}\);[\s\S]*\},\s*1600\);/);

const randomLayoutCalls = js.match(/setPipelineRandomLayout\(/g) || [];
assert.strictEqual(randomLayoutCalls.length, 2);
assert.doesNotMatch(
  js.match(/async function playSequence\(\) \{[\s\S]*?\n  \}/)[0],
  /setPipelineRandomLayout\(/,
);
