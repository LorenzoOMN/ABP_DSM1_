"use strict";

const assert = require("assert");
const {
  calcularEstadoIntroNarrativa,
  calcularLimiaresLinhasIntro,
  calcularProgressoBlackoutHero,
} = require("../../public/assets/js/capitulo4.js");

assert.strictEqual(calcularProgressoBlackoutHero(0, 0, 600), 0);
assert.strictEqual(calcularProgressoBlackoutHero(300, 0, 600), 0.5);
assert.strictEqual(calcularProgressoBlackoutHero(600, 0, 600), 1);
assert.strictEqual(calcularProgressoBlackoutHero(900, 0, 600), 1);
assert.strictEqual(calcularProgressoBlackoutHero(-100, 0, 600), 0);
assert.strictEqual(calcularProgressoBlackoutHero(100, 100, 0), 0);
assert.strictEqual(calcularProgressoBlackoutHero(101, 100, 0), 1);

const lineThresholds = calcularLimiaresLinhasIntro();
assert.strictEqual(lineThresholds.length, 5);
lineThresholds.slice(1).forEach((threshold, index) => {
  const previousGap = lineThresholds[index] - (index === 0 ? 0 : lineThresholds[index - 1]);
  const currentGap = threshold - lineThresholds[index];

  assert.ok(Math.abs(currentGap - previousGap) < Number.EPSILON);
});

assert.strictEqual(calcularEstadoIntroNarrativa(0).phase, "hidden");
assert.strictEqual(calcularEstadoIntroNarrativa(0.3).phase, "prelude");
assert.strictEqual(calcularEstadoIntroNarrativa(0.3).showPrelude, false);
assert.strictEqual(calcularEstadoIntroNarrativa(0.3).showHourglass, false);
assert.strictEqual(calcularEstadoIntroNarrativa(0.92).showPrelude, true);
assert.ok(calcularEstadoIntroNarrativa(0.92).introOpacity > 0);
assert.ok(calcularEstadoIntroNarrativa(0.92).introOpacity < 1);
assert.strictEqual(calcularEstadoIntroNarrativa(1).phase, "full");
assert.strictEqual(calcularEstadoIntroNarrativa(1).showHourglass, true);
assert.strictEqual(calcularEstadoIntroNarrativa(1, 0.06).showPrelude, true);
assert.strictEqual(calcularEstadoIntroNarrativa(1, 0.12).showPrelude, true);
assert.strictEqual(calcularEstadoIntroNarrativa(1, 0.77).showPrelude, true);
assert.strictEqual(calcularEstadoIntroNarrativa(1, 0).visibleLines, 0);
assert.strictEqual(calcularEstadoIntroNarrativa(1, 0.2).visibleLines, 1);
assert.strictEqual(calcularEstadoIntroNarrativa(1, 0.2).activeLineIndex, 0);
assert.strictEqual(calcularEstadoIntroNarrativa(1, 0.36).visibleLines, 2);
assert.strictEqual(calcularEstadoIntroNarrativa(1, 0.36).activeLineIndex, 1);
assert.strictEqual(calcularEstadoIntroNarrativa(1, 0.77).visibleLines, 5);
assert.strictEqual(calcularEstadoIntroNarrativa(1, 0.77).activeLineIndex, 4);
assert.strictEqual(calcularEstadoIntroNarrativa(1, 0.92).phase, "outro");
assert.ok(calcularEstadoIntroNarrativa(1, 0.92).introOpacity < 1);
assert.strictEqual(calcularEstadoIntroNarrativa(1, 1).phase, "hidden");
