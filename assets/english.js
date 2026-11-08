/* 國小學習群島 — 英文科：資料與遊戲模式；hub／航線殼層見 subject.js */
(function () {
  'use strict';

  var DATA = window.ENGLISH_ISLES_DATA;
  if (!window.IslesSubject) {
    document.body.innerHTML = '<p style="padding:2rem">載入失敗：缺少 subject.js。</p>';
    return;
  }

  function englishPlay(api) {
    var C = api.C, P = api.P, DATA = api.data;
    var $ = api.$, $$ = api.$$, shuffle = C.shuffle;
    var escapeHtml = api.escapeHtml, escapeAttr = api.escapeAttr;
    var el = api.el, state = api.state;
    var resultHtml = api.resultHtml, bindResult = api.bindResult, awardModeStar = api.awardModeStar;

    var wordById = {}; DATA.words.forEach(function (w) { wordById[w.id] = w; });
    var grammarById = {}; DATA.grammar.forEach(function (g) { grammarById[g.id] = g; });

    function lessonWords(lesson) {
      return (lesson.wordIds || []).map(function (id) { return wordById[id]; }).filter(Boolean);
    }
    // ---- 看英選中 / 看中選英 ----
    function runQuiz(lesson, mode) {
      var words = shuffle(lessonWords(lesson));
      var roundN = Math.min(8, Math.max(4, words.length));
      var pool = words.slice(0, roundN);
      var allForChoices = lessonWords(lesson);
      var broader = DATA.words.filter(function (w) { return w.grade <= state.grade; });
      var i = 0, correct = 0, locked = false;

      function finish() {
        var pass = correct / pool.length >= 0.7;
        if (pass) awardModeStar(lesson.id, mode);
        var msgs = pass ? ['太棒了！', '做得好！', '星星亮起來了！'] : ['再試一次會更熟！', '差一點，加油！', '我們再玩一回吧！'];
        el.chBody.innerHTML = resultHtml(pass, msgs[Math.floor(Math.random() * msgs.length)],
          '答對 ' + correct + ' / ' + pool.length + (pass ? ' · 已記下這顆 ★' : ''));
        bindResult(lesson, mode);
      }
      function renderQ() {
        if (i >= pool.length) return finish();
        locked = false;
        var w = pool[i];
        var askEn = mode === 'en2zh';
        var prompt = askEn ? w.en : w.zh;
        var answer = askEn ? w.zh : w.en;
        var choices = shuffle(uniqueChoices(answer,
          allForChoices.map(function (x) { return askEn ? x.zh : x.en; }),
          broader.map(function (x) { return askEn ? x.zh : x.en; }), 4));
        el.chBody.innerHTML =
          '<div class="progress-bar" aria-hidden="true"><span style="width:' + (i / pool.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            '<p class="q-sub">第 ' + (i + 1) + ' / ' + pool.length + ' 題</p>' +
            (w.emoji && askEn ? '<div class="q-emoji">' + w.emoji + '</div>' : '') +
            '<div class="q-prompt">' + escapeHtml(prompt) + '</div>' +
            (askEn ? '<button type="button" class="speak-btn" data-speak="' + escapeAttr(w.en) + '">🔊 聽發音</button>' : '') +
            '<div class="choices" role="group" aria-label="選項">' +
              choices.map(function (c) { return '<button type="button" class="choice" data-choice="' + escapeAttr(c) + '">' + escapeHtml(c) + '</button>'; }).join('') +
            '</div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
          '</div>';
      }
      el.chBody.onclick = function (e) {
        var sp = e.target.closest('[data-speak]');
        if (sp) { C.speak(sp.dataset.speak); return; }
        var btn = e.target.closest('.choice');
        if (!btn || btn.disabled || locked) return;
        locked = true;
        var w = pool[i];
        var answer = mode === 'en2zh' ? w.zh : w.en;
        var ok = btn.dataset.choice === answer;
        $$('.choice', el.chBody).forEach(function (c) {
          c.disabled = true;
          if (c.dataset.choice === answer) c.classList.add('correct');
          else if (c === btn && !ok) c.classList.add('wrong');
          else c.classList.add('dim');
        });
        var fb = $('#fb', el.chBody);
        if (ok) { correct++; fb.textContent = '答對了！真厲害'; fb.className = 'feedback ok'; }
        else { fb.textContent = '答案是「' + answer + '」'; fb.className = 'feedback no'; }
        setTimeout(function () { i++; renderQ(); }, ok ? 550 : 900);
      };
      renderQ();
    }
    function uniqueChoices(answer, primary, fallback, n) {
      var set = [answer];
      var pool = shuffle(primary.concat(fallback).filter(function (x) { return x && x !== answer; }));
      for (var k = 0; k < pool.length && set.length < n; k++) if (set.indexOf(pool[k]) < 0) set.push(pool[k]);
      return set;
    }

    // ---- 配對 ----
    function runMatch(lesson) {
      var all = lessonWords(lesson);
      var words = shuffle(all).slice(0, Math.min(6, all.length));
      var left = shuffle(words.map(function (w) { return { id: w.id, text: w.en }; }));
      var right = shuffle(words.map(function (w) { return { id: w.id, text: w.zh }; }));
      var selected = null, matched = 0, mistakes = 0;

      function col(list, side) {
        return list.map(function (c) {
          return '<button type="button" class="match-card' + (c.done ? ' matched' : '') + '" data-id="' + c.id + '" data-side="' + side + '"' + (c.done ? ' disabled' : '') + '>' + escapeHtml(c.text) + '</button>';
        }).join('');
      }
      function paint() {
        el.chBody.innerHTML =
          '<p class="q-sub" style="text-align:center">先點英文，再點中文配對 · ' + matched + '/' + words.length + '</p>' +
          '<div class="match-board"><div class="match-col" id="col-en">' + col(left, 'en') + '</div>' +
          '<div class="match-col" id="col-zh">' + col(right, 'zh') + '</div></div>' +
          '<p class="feedback" id="fb" aria-live="polite"></p>';
      }
      function done() {
        if (matched === words.length) awardModeStar(lesson.id, 'match');
        el.chBody.innerHTML = resultHtml(true, '配對完成！',
          matched + ' 組都對上了' + (mistakes ? '（中途點錯 ' + mistakes + ' 次，沒關係）' : ''));
        bindResult(lesson, 'match');
      }
      paint();
      el.chBody.onclick = function (e) {
        var btn = e.target.closest('.match-card');
        if (!btn || btn.disabled || btn.classList.contains('matched')) return;
        var side = btn.dataset.side;
        var id = Number(btn.dataset.id);
        var fb = $('#fb');
        if (!selected) {
          if (side !== 'en') { fb.textContent = '先選左邊的英文喔'; fb.className = 'feedback no'; return; }
          selected = { id: id, btn: btn };
          btn.classList.add('selected');
          C.speak(btn.textContent.trim());
          return;
        }
        if (side === 'en') {
          selected.btn.classList.remove('selected');
          selected = { id: id, btn: btn };
          btn.classList.add('selected');
          C.speak(btn.textContent.trim());
          return;
        }
        if (id === selected.id) {
          btn.classList.add('matched');
          selected.btn.classList.add('matched');
          selected.btn.classList.remove('selected');
          btn.disabled = true;
          selected.btn.disabled = true;
          left.forEach(function (x) { if (x.id === id) x.done = true; });
          right.forEach(function (x) { if (x.id === id) x.done = true; });
          selected = null;
          matched++;
          fb.textContent = '配對成功！'; fb.className = 'feedback ok';
          var sub = $('.q-sub', el.chBody);
          if (sub) sub.textContent = '先點英文，再點中文配對 · ' + matched + '/' + words.length;
          if (matched >= words.length) setTimeout(done, 400);
        } else {
          mistakes++;
          btn.classList.add('shake');
          selected.btn.classList.add('shake');
          fb.textContent = '再想一想～'; fb.className = 'feedback no';
          var prev = selected;
          selected = null;
          setTimeout(function () {
            btn.classList.remove('shake');
            prev.btn.classList.remove('shake', 'selected');
          }, 350);
        }
      };
    }

    // ---- 拼拼看（四年級起）----
    function runScramble(lesson) {
      var lw = lessonWords(lesson);
      var candidates = lw.filter(function (w) {
        var t = w.en.replace(/\s/g, '');
        return /^[A-Za-z]+(?:\s+[A-Za-z]+)?$/.test(w.en) && t.length >= 3 && t.length <= 10;
      });
      var words = shuffle(candidates.length ? candidates : lw).slice(0, Math.min(6, Math.max(3, candidates.length || lw.length)));
      var i = 0, correct = 0;

      function render() {
        if (i >= words.length) return finish();
        var w = words[i];
        var letters = w.en.replace(/\s/g, '').split('');
        var answer = letters.join('');
        var tray = shuffle(letters.map(function (ch) { return { ch: ch, used: false }; }));
        var slots = letters.map(function () { return null; });
        el.chBody.innerHTML =
          '<div class="progress-bar"><span style="width:' + (i / words.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            '<p class="q-sub">第 ' + (i + 1) + ' / ' + words.length + ' 題 · 中文：' + escapeHtml(w.zh) + '</p>' +
            (w.emoji ? '<div class="q-emoji">' + w.emoji + '</div>' : '') +
            '<button type="button" class="speak-btn" data-speak="' + escapeAttr(w.en) + '">🔊 聽發音</button>' +
            '<div class="scramble-slots" id="slots"></div>' +
            '<div class="scramble-tray" id="tray"></div>' +
            '<div class="btn-row" style="margin-top:.5rem">' +
              '<button type="button" class="btn secondary" id="sc-clear">清空</button>' +
              '<button type="button" class="btn primary" id="sc-check">完成</button>' +
            '</div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
          '</div>';
        var slotsEl = $('#slots'), trayEl = $('#tray');
        function draw() {
          slotsEl.innerHTML = slots.map(function (s, si) {
            return s ? '<button type="button" class="letter filled" data-slot="' + si + '">' + escapeHtml(s.ch) + '</button>'
                     : '<span class="letter slot" data-slot="' + si + '"></span>';
          }).join('');
          trayEl.innerHTML = tray.map(function (t, ti) {
            return '<button type="button" class="letter tray" data-tray="' + ti + '"' + (t.used ? ' disabled' : '') + '>' + escapeHtml(t.ch) + '</button>';
          }).join('');
        }
        draw();
        var answered = false;
        el.chBody.onclick = function (e) {
          if (e.target.closest('[data-speak]')) { C.speak(w.en); return; }
          if (answered) return;
          var tbtn = e.target.closest('[data-tray]');
          if (tbtn && !tbtn.disabled) {
            var ti = Number(tbtn.dataset.tray);
            var empty = slots.findIndex(function (s) { return !s; });
            if (empty < 0) return;
            slots[empty] = tray[ti];
            tray[ti].used = true;
            draw();
            return;
          }
          var sbtn = e.target.closest('.letter.filled[data-slot]');
          if (sbtn) {
            var si = Number(sbtn.dataset.slot);
            var item = slots[si];
            if (!item) return;
            item.used = false;
            slots[si] = null;
            draw();
            return;
          }
          if (e.target.id === 'sc-clear') {
            for (var k = 0; k < slots.length; k++) slots[k] = null;
            tray.forEach(function (t) { t.used = false; });
            draw();
            return;
          }
          if (e.target.id === 'sc-check') {
            var built = slots.map(function (s) { return s ? s.ch : ''; }).join('');
            var fb = $('#fb');
            answered = true;
            if (built.toLowerCase() === answer.toLowerCase()) {
              correct++;
              fb.textContent = '拼對了！'; fb.className = 'feedback ok';
              setTimeout(function () { i++; render(); }, 600);
            } else {
              fb.textContent = '再排一次，答案是 ' + w.en; fb.className = 'feedback no';
              setTimeout(function () { i++; render(); }, 1100);
            }
          }
        };
      }
      function finish() {
        var pass = correct / words.length >= 0.7;
        if (pass) awardModeStar(lesson.id, 'scramble');
        el.chBody.innerHTML = resultHtml(pass, pass ? '拼字高手！' : '再練一次會更熟', '答對 ' + correct + ' / ' + words.length);
        bindResult(lesson, 'scramble');
      }
      render();
    }

    // ---- 句型 ----
    function runGrammar(lesson) {
      var g = grammarById[lesson.grammarId];
      if (!g) { el.chBody.innerHTML = '<p>找不到這個句型資料。</p>'; return; }
      var items = buildGrammarItems(g);
      var i = 0, correct = 0;
      el.chBody.onclick = null;

      function showIntro() {
        el.chBody.innerHTML =
          '<div class="grammar-intro">' +
            '<h3>' + escapeHtml(g.name_zh) + '</h3>' +
            '<p>' + escapeHtml(g.zh) + '</p>' +
            '<ul class="pattern-list">' + (g.patterns || []).slice(0, 4).map(function (p) { return '<li>' + escapeHtml(p) + '</li>'; }).join('') + '</ul>' +
          '</div>' +
          '<p class="q-sub" style="text-align:center">來看幾個例子，再玩玩看！</p>' +
          '<ul class="pattern-list" style="margin-bottom:1rem">' + (g.examples || []).slice(0, 3).map(function (ex) {
            return '<li><button type="button" class="ex-speak" data-speak="' + escapeAttr(ex) + '" aria-label="聽例句">🔊</button> ' + escapeHtml(ex) + '</li>';
          }).join('') + '</ul>' +
          '<div class="btn-row"><button type="button" class="btn primary" id="start-gq">開始練習</button></div>';
        el.chBody.onclick = function (e) {
          var sp = e.target.closest('[data-speak]');
          if (sp) C.speak(sp.dataset.speak);
        };
        $('#start-gq').onclick = function () { renderQ(); };
      }
      function renderQ() {
        if (i >= items.length) return finish();
        var item = items[i];
        el.chBody.innerHTML =
          '<div class="progress-bar"><span style="width:' + (i / items.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            '<p class="q-sub">第 ' + (i + 1) + ' / ' + items.length + ' 題</p>' +
            '<div class="q-prompt" style="font-size:1.25rem">' + escapeHtml(item.prompt) + '</div>' +
            '<div class="choices" style="margin-top:1rem">' +
              item.choices.map(function (c) { return '<button type="button" class="choice" data-c="' + escapeAttr(c) + '">' + escapeHtml(c) + '</button>'; }).join('') +
            '</div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
          '</div>';
        el.chBody.onclick = function (e) {
          var btn = e.target.closest('.choice');
          if (!btn || btn.disabled) return;
          var ok = btn.dataset.c === item.answer;
          $$('.choice', el.chBody).forEach(function (c) {
            c.disabled = true;
            if (c.dataset.c === item.answer) c.classList.add('correct');
            else if (c === btn && !ok) c.classList.add('wrong');
            else c.classList.add('dim');
          });
          var fb = $('#fb');
          if (ok) { correct++; fb.textContent = '答對了！'; fb.className = 'feedback ok'; }
          else { fb.textContent = '正確是「' + item.answer + '」'; fb.className = 'feedback no'; }
          setTimeout(function () { i++; renderQ(); }, ok ? 550 : 950);
        };
      }
      function finish() {
        var pass = correct / items.length >= 0.7;
        if (pass) awardModeStar(lesson.id, 'grammar');
        el.chBody.innerHTML = resultHtml(pass, pass ? '句型學會了！' : '再看一次說明吧', '答對 ' + correct + ' / ' + items.length);
        bindResult(lesson, 'grammar');
      }
      showIntro();
    }

    function unique(arr) {
      var out = [];
      arr.forEach(function (x) { if (x && out.indexOf(x) < 0) out.push(x); });
      return out;
    }
    function mutateSentence(s, variant) {
      if (!s) return '';
      var parts = s.replace(/[.?!~]$/, '').split(/\s+/);
      if (parts.length < 2) return s + (variant ? '!!' : '?');
      var copy = parts.slice();
      if (variant === 2) { copy.splice(1, 1); return copy.join(' ') + '.'; }
      var t = copy[0]; copy[0] = copy[1]; copy[1] = t;
      return copy.join(' ') + '.';
    }
    function soften(s) {
      return s.replace(/\bis\b/i, 'are').replace(/\bare\b/i, 'is').replace(/\bam\b/i, 'is');
    }
    function buildGrammarItems(g) {
      var items = [];
      var examples = (g.examples || []).filter(Boolean);
      var otherPatterns = [];
      DATA.grammar.forEach(function (x) { if (x.id !== g.id) (x.patterns || []).forEach(function (p) { if (p) otherPatterns.push(p); }); });
      examples.forEach(function (ex) {
        var wrongs = [mutateSentence(ex), mutateSentence(ex, 2), soften(ex)].filter(function (w) { return w && w !== ex; });
        var choices = unique([ex].concat(wrongs)).slice(0, 4);
        while (choices.length < 2) choices.push(ex + '?');
        items.push({ prompt: '哪一句才對？', choices: shuffle(choices), answer: ex });
      });
      (g.patterns || []).slice(0, 3).forEach(function (pat) {
        var distractors = shuffle(otherPatterns.filter(function (p) { return p !== pat; })).slice(0, 3);
        var choices = unique([pat].concat(distractors)).slice(0, 4);
        if (choices.length >= 2) items.push({ prompt: '「' + g.name_zh + '」常用哪一種？', choices: shuffle(choices), answer: pat });
      });
      while (items.length < 4 && examples.length) {
        var ex = examples[items.length % examples.length];
        var pool = unique([ex].concat(examples.map(soften), examples.map(function (e) { return mutateSentence(e); })));
        var ch = shuffle(pool).slice(0, 4);
        if (ch.indexOf(ex) < 0) ch[0] = ex;
        items.push({ prompt: '選出正確的例句', choices: shuffle(ch), answer: ex });
      }
      return shuffle(items).slice(0, 6);
    }


    function startMode(lesson, mode) {
      if (lesson.type === 'grammar') runGrammar(lesson);
      else if (mode === 'match') runMatch(lesson);
      else if (mode === 'scramble') runScramble(lesson);
      else runQuiz(lesson, mode);
    }

    return {
      startMode: startMode,
      onCloseChallenge: function () { C.stopSpeak(); }
    };
  }

  window.IslesSubject.boot({
    subject: 'english',
    data: DATA,
    loadError: '資料載入失敗，請確認 assets/ 資料夾裡的 data.js、core.js、companions.js、ui.js、subject.js 都在。',
    titleSuffix: '國小學習群島',
    legacyHash: true,
    sailOnIslandClick: true,
    unitListUsesHash: true,
    gradeBuddy: ['', 'chirp', 'sprout', 'drop', 'ember', 'puff', 'luna'],
    track: function (g) {
      return g <= 2 ? { text: '先修準備', cls: 'warmup' } : g === 6 ? { text: '衔接國中', cls: 'bridge' } : { text: '課綱進度', cls: '' };
    },
    hubMeta: function (rm, g) {
      var meta = (rm.newWords || 0) + ' 新字・' + (rm.grammar || 0) + ' 句型';
      if (g === 6) meta = '衔接文法・複習島';
      else if (rm.reviewLessons) meta += '・複習 ' + rm.reviewLessons + ' 關';
      return meta;
    },
    routeLead: function (rm, grade) {
      var lead = grade === 6
        ? '這學期沒有新的 300 字，練銜接國中的句型，再到複習島溫習。'
        : '本學期新學 ' + (rm.newWords || 0) + ' 個字、' + (rm.grammar || 0) + ' 個句型。選一座島全部逛，或從下面挑一關。';
      if (grade <= 2) lead += '（先修準備：正式英語多自三年級起）';
      return lead;
    },
    lessonIcon: function (L, isl) {
      return L.type === 'grammar' ? '💬' : L.review ? '🔁' : isl.symbol;
    },
    challengeKicker: function (lesson) {
      return lesson.type === 'grammar' ? '句型挑戰' : '單字挑戰';
    },
    parseHashExtra: function (h, map, DATA) {
      var topic = decodeURIComponent(h);
      for (var i = 0; i < DATA.islands.length; i++) {
        var isl = DATA.islands[i];
        var les = map[isl.id] || [];
        if (isl.id === topic) return { view: 'island', islandId: isl.id };
        if (les.some(function (L) { return L.topic === topic || L.id === topic || L.name.indexOf(topic) >= 0; })) {
          return { view: 'island', islandId: isl.id };
        }
      }
      return null;
    },
    resetConfirm: function (label) {
      return '確定要清除「' + label + '」的星星進度嗎？';
    },
    resetAlert: function (label) {
      return '已重置「' + label + '」進度。';
    },
    play: englishPlay
  });
})();
