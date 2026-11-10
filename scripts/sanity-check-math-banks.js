#!/usr/bin/env node
'use strict';

/**
 * Sanity-check thickened math banks (2-1, 2-2, 4-1, 4-2) and rebuild output.
 */
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.join(__dirname, '..');
var TARGETS = {
  '2-1': {
    lessons: {
      'm21-count1': { scaffold: 8, error: 4 },
      'm21-calc1': { scaffold: 8, error: 4 },
      'm21-calc2': { scaffold: 8, error: 4, word: 6 },
      'm21-measure1': { scaffold: 8, word: 6 },
      'm21-review1': { recap: 1, recapQ: 8 }
    }
  },
  '2-2': {
    lessons: {
      'm22-calc1': { scaffold: 8, visual: 8 },
      'm22-calc2': { scaffold: 8, word: 6, error: 4 },
      'm22-measure1': { scaffold: 8, word: 6 },
      'm22-apply1': { word: 6, scaffold: 8 },
      'm22-review1': { recap: 1, recapQ: 8 }
    }
  },
  '4-1': {
    lessons: {
      'm41-count1': { scaffold: 8, error: 4 },
      'm41-calc1': { scaffold: 8, error: 4 },
      'm41-frac1': { scaffold: 8, word: 6 },
      'm41-shape1': { scaffold: 8, word: 6 },
      'm41-review1': { recap: 1, recapQ: 8 }
    }
  },
  '4-2': {
    lessons: {
      'm42-frac1': { scaffold: 8, error: 4 },
      'm42-calc1': { scaffold: 8, error: 4, word: 6 },
      'm42-shape1': { scaffold: 8, word: 6 },
      'm42-apply1': { scaffold: 8, word: 6, error: 4 },
      'm42-review1': { recap: 1, recapQ: 8 }
    }
  }
};

function fail(msg) {
  console.error('FAIL:', msg);
  process.exitCode = 1;
}

function loadData() {
  var code = fs.readFileSync(path.join(ROOT, 'assets', 'math-data.js'), 'utf8');
  var ctx = { window: {} };
  vm.runInNewContext(code, ctx);
  return ctx.window.MATH_ISLES_DATA;
}

function flattenLessons(byIsland) {
  var out = [];
  Object.keys(byIsland).forEach(function (k) {
    byIsland[k].forEach(function (L) { out.push(L); });
  });
  return out;
}

function checkProblem(route, lesson, p) {
  var tag = route + '/' + lesson.id + '/' + p.id;
  if (!p.kind) fail(tag + ' missing kind');
  if (!p.id) fail(tag + ' missing id');

  if (p.kind === 'scaffold' || p.kind === 'visual') {
    if (!p.prompt && !p.expression) fail(tag + ' missing prompt');
    if (p.answer == null || p.answer === '') fail(tag + ' missing answer');
    if (!Array.isArray(p.answers) || !p.answers.length) fail(tag + ' missing answers[]');
    if (!Array.isArray(p.hints) || p.hints.length < 4) fail(tag + ' needs 4 hints');
  }
  if (p.kind === 'word') {
    if (!p.story) fail(tag + ' missing story');
    if (!p.whatOptions || !p.opOptions) fail(tag + ' missing choice options');
    if (p.answer == null || p.answer === '') fail(tag + ' missing answer');
    if (!Array.isArray(p.answers) || !p.answers.length) fail(tag + ' missing answers[]');
    if (!Array.isArray(p.hints) || p.hints.length < 4) fail(tag + ' needs 4 hints');
  }
  if (p.kind === 'error') {
    if (!Array.isArray(p.lines) || !p.lines.length) fail(tag + ' missing lines');
    if (typeof p.wrongIndex !== 'number') fail(tag + ' missing wrongIndex');
    if (!p.why && !(p.lines[p.wrongIndex] && p.lines[p.wrongIndex].why)) fail(tag + ' missing why');
    if (p.correctAnswer == null) fail(tag + ' missing correctAnswer');
    var primaryWrong = 0;
    p.lines.forEach(function (line, i) {
      if (line.ok === false) primaryWrong++;
      if (i === p.wrongIndex && line.ok !== false) fail(tag + ' wrongIndex line should be ok:false');
    });
    if (primaryWrong < 1) fail(tag + ' needs at least one ok:false line');
  }
  if (p.kind === 'recap') {
    if (!Array.isArray(p.questions) || !p.questions.length) fail(tag + ' missing questions');
    p.questions.forEach(function (q, qi) {
      if (!q.q || q.a == null || !Array.isArray(q.answers) || !q.answers.length) {
        fail(tag + ' question[' + qi + '] incomplete');
      }
    });
  }
}

function main() {
  require(path.join(__dirname, 'build-math-data.js'));
  var DATA = loadData();
  var report = [];

  Object.keys(TARGETS).forEach(function (route) {
    var lessons = flattenLessons(DATA.lessonsByRoute[route] || {});
    var byId = {};
    lessons.forEach(function (L) { byId[L.id] = L; });
    var totals = { scaffold: 0, visual: 0, word: 0, error: 0, recap: 0, recapQ: 0, problems: 0 };
    var expectLessons = TARGETS[route].lessons;

    Object.keys(expectLessons).forEach(function (lid) {
      var L = byId[lid];
      if (!L) return fail(route + ' missing lesson ' + lid);
      var kinds = { scaffold: 0, visual: 0, word: 0, error: 0, recap: 0 };
      var ids = {};
      L.problems.forEach(function (p) {
        if (ids[p.id]) fail(route + '/' + lid + ' duplicate id ' + p.id);
        ids[p.id] = true;
        kinds[p.kind] = (kinds[p.kind] || 0) + 1;
        totals[p.kind] = (totals[p.kind] || 0) + 1;
        totals.problems++;
        if (p.kind === 'recap') totals.recapQ += (p.questions || []).length;
        checkProblem(route, L, p);
      });
      Object.keys(expectLessons[lid]).forEach(function (k) {
        if (k === 'recapQ') {
          var qn = (L.problems.find(function (p) { return p.kind === 'recap'; }) || {}).questions || [];
          if (qn.length < expectLessons[lid].recapQ) {
            fail(route + '/' + lid + ' recapQ ' + qn.length + ' < ' + expectLessons[lid].recapQ);
          }
        } else if ((kinds[k] || 0) < expectLessons[lid][k]) {
          fail(route + '/' + lid + ' ' + k + ' ' + (kinds[k] || 0) + ' < ' + expectLessons[lid][k]);
        }
      });
      L.modes.forEach(function (mode) {
        var count = mode === 'recap'
          ? (L.problems.filter(function (p) { return p.kind === 'recap'; }).length)
          : (kinds[mode] || 0);
        if (!count) fail(route + '/' + lid + ' mode ' + mode + ' has empty pool');
      });
    });

    var starsAll = DATA.routeMeta[route].starsAll;
    var modeCount = 0;
    lessons.forEach(function (L) { modeCount += L.modes.length; });
    if (starsAll !== modeCount) fail(route + ' starsAll mismatch ' + starsAll + ' vs ' + modeCount);

    report.push({ route: route, lessons: lessons.length, totals: totals, starsAll: starsAll });
  });

  // math.js caps
  var mathJs = fs.readFileSync(path.join(ROOT, 'assets', 'math.js'), 'utf8');
  if (!/runScaffold[\s\S]*?Math\.min\(6, pool\.length\)/.test(mathJs)) fail('scaffold cap not 6');
  if (!/runVisual[\s\S]*?Math\.min\(6, pool\.length\)/.test(mathJs)) fail('visual cap not 6');
  if (!/awardModeStar\(lesson\.id, 'word'\)[\s\S]{0,200}/.test(mathJs)) fail('word mode missing');
  if (!mathJs.includes('Math.min(4, pool.length)')) fail('expected min(4) caps for word/error');

  console.log('\nBefore/after style summary (after):');
  report.forEach(function (r) {
    console.log(r.route, 'lessons=' + r.lessons, 'starsAll=' + r.starsAll, JSON.stringify(r.totals));
  });

  if (process.exitCode) {
    console.error('\nSanity check FAILED');
    process.exit(1);
  }
  console.log('\nSanity check OK');
}

main();
