/* 國小數學群島 — 數學科：資料與遊戲模式；hub／航線殼層見 subject.js */
(function () {
  'use strict';

  var DATA = window.MATH_ISLES_DATA;
  if (!window.IslesSubject) {
    document.body.innerHTML = '<p style="padding:2rem">載入失敗：缺少 subject.js。</p>';
    return;
  }

  function mathPlay(api) {
    var C = api.C, P = api.P, DATA = api.data;
    var $ = api.$, $$ = api.$$, shuffle = C.shuffle;
    var escapeHtml = api.escapeHtml, escapeAttr = api.escapeAttr;
    var el = api.el, state = api.state;
    var resultHtml = api.resultHtml, bindResult = api.bindResult, awardModeStar = api.awardModeStar;

    function coachAsk(text) {
      return '<div class="math-coach"><p class="ask">' + escapeHtml(text) + '</p></div>';
    }
    function hintUi(level, hints) {
      if (level <= 0) return '';
      var idx = Math.min(level, hints.length) - 1;
      var labels = ['小提示', '更清楚一點', '示範一步', '完整說明'];
      return '<div class="hint-box"><div class="hint-level">' + labels[Math.min(idx, 3)] + '</div>' +
        escapeHtml(hints[idx] || '') + '</div>';
    }
    function pitfallNote(p) {
      var map = {
        regroup: '記得檢查「進位」有沒有加進去。',
        borrow: '退位時，十位被借走要少 1。',
        place: '看看數字站在哪個位置（個位／十位……）。',
        unit: '答案的單位對了嗎？',
        compare: '比大小時，先對齊位值。',
        misread: '再讀一次題目，看它到底問什麼。'
      };
      return p && p.pitfall && map[p.pitfall] ? '<p class="why-box">' + escapeHtml(map[p.pitfall]) + '</p>' : '';
    }

    // ---- 一步一步算（提示階梯）----
    function runScaffold(lesson, pool) {
      var list = shuffle(pool).slice(0, Math.min(6, pool.length));
      var i = 0, correct = 0, hintLevel = 0, locked = false;

      function finish() {
        var pass = correct / list.length >= 0.6;
        if (pass) awardModeStar(lesson.id, 'scaffold');
        el.chBody.innerHTML = resultHtml(pass, pass ? '算得真仔細！' : '再練一次會更熟！',
          '過關 ' + correct + ' / ' + list.length + (pass ? ' · 已記下這顆 ★' : ''));
        bindResult(lesson, 'scaffold');
      }
      function render() {
        if (i >= list.length) return finish();
        locked = false;
        hintLevel = 0;
        var p = list[i];
        var visuals = (p.visuals || []).map(function (v) { return '<span>' + escapeHtml(v) + '</span>'; }).join('');
        el.chBody.innerHTML =
          '<div class="progress-bar"><span style="width:' + (i / list.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            '<p class="q-sub">第 ' + (i + 1) + ' / ' + list.length + ' 題</p>' +
            (p.companionAsk ? coachAsk(p.companionAsk) : '') +
            '<p class="q-prompt">' + escapeHtml(p.prompt || p.expression || '') + '</p>' +
            (visuals ? '<div class="math-visual">' + visuals + '</div>' : '') +
            (p.expression ? '<div class="math-expression">' + escapeHtml(p.expression) + '</div>' : '') +
            '<div id="hint-slot"></div>' +
            '<div class="answer-row">' +
              '<input type="text" id="ans" inputmode="text" autocomplete="off" aria-label="你的答案" placeholder="寫答案" />' +
              '<button type="button" class="btn primary" id="check">試試看</button>' +
            '</div>' +
            '<div class="hint-actions">' +
              '<button type="button" class="btn secondary" id="more-hint">我需要提示</button>' +
            '</div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
          '</div>';
        $('#ans').focus();
        $('#more-hint').onclick = function () {
          var hints = p.hints || ['再想一想～', '把步驟寫下來。', '先算一部分。', '答案是 ' + (p.answer || '')];
          if (hintLevel < hints.length) hintLevel++;
          $('#hint-slot').innerHTML = hintUi(hintLevel, hints);
        };
        $('#check').onclick = function () { submit(); };
        $('#ans').onkeydown = function (e) { if (e.key === 'Enter') submit(); };
      }
      function submit() {
        if (locked) return;
        var p = list[i];
        var val = $('#ans').value;
        var ok = C.answersMatch(val, p.answers || [p.answer]);
        locked = true;
        var fb = $('#fb');
        if (ok) {
          correct++;
          fb.textContent = '答對了！你有先自己試，真棒！';
          fb.className = 'feedback ok';
          setTimeout(function () { i++; render(); }, 700);
        } else {
          fb.textContent = '還差一點。要不要先看提示，再試一次？';
          fb.className = 'feedback no';
          locked = false;
          if (hintLevel === 0) {
            hintLevel = 1;
            $('#hint-slot').innerHTML = hintUi(hintLevel, p.hints || []) + pitfallNote(p);
          }
        }
      }
      render();
    }

    // ---- 數一數（具體物）----
    function runVisual(lesson, pool) {
      var list = shuffle(pool).slice(0, Math.min(6, pool.length));
      var i = 0, correct = 0, hintLevel = 0, locked = false;
      function finish() {
        var pass = correct / list.length >= 0.6;
        if (pass) awardModeStar(lesson.id, 'visual');
        el.chBody.innerHTML = resultHtml(pass, pass ? '數得很清楚！' : '再數一次會更準！',
          '過關 ' + correct + ' / ' + list.length + (pass ? ' · 已記下這顆 ★' : ''));
        bindResult(lesson, 'visual');
      }
      function render() {
        if (i >= list.length) return finish();
        locked = false; hintLevel = 0;
        var p = list[i];
        var items = (p.items || []).map(function (it) { return '<span>' + escapeHtml(it) + '</span>'; }).join('');
        el.chBody.innerHTML =
          '<div class="progress-bar"><span style="width:' + (i / list.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            (p.companionAsk ? coachAsk(p.companionAsk) : coachAsk('先用眼睛數，再寫數字～')) +
            '<p class="q-prompt">' + escapeHtml(p.prompt) + '</p>' +
            '<div class="math-visual">' + items + '</div>' +
            '<div id="hint-slot"></div>' +
            '<div class="answer-row">' +
              '<input type="text" id="ans" inputmode="numeric" autocomplete="off" aria-label="你的答案" placeholder="幾個？" />' +
              '<button type="button" class="btn primary" id="check">試試看</button>' +
            '</div>' +
            '<div class="hint-actions"><button type="button" class="btn secondary" id="more-hint">我需要提示</button></div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
          '</div>';
        $('#ans').focus();
        $('#more-hint').onclick = function () {
          var hints = p.hints || [];
          if (hintLevel < hints.length) hintLevel++;
          $('#hint-slot').innerHTML = hintUi(hintLevel, hints);
        };
        $('#check').onclick = submit;
        $('#ans').onkeydown = function (e) { if (e.key === 'Enter') submit(); };
      }
      function submit() {
        if (locked) return;
        var p = list[i];
        var ok = C.answersMatch($('#ans').value, p.answers || [p.answer]);
        locked = true;
        var fb = $('#fb');
        if (ok) {
          correct++;
          fb.textContent = '數對了！'; fb.className = 'feedback ok';
          setTimeout(function () { i++; render(); }, 650);
        } else {
          fb.textContent = '再數一次，可以用手指點喔。'; fb.className = 'feedback no';
          locked = false;
          if (hintLevel === 0) { hintLevel = 1; $('#hint-slot').innerHTML = hintUi(1, p.hints || []); }
        }
      }
      render();
    }

    // ---- 應用題：先懂再算 ----
    function runWord(lesson, pool) {
      var list = shuffle(pool).slice(0, Math.min(4, pool.length));
      var i = 0, correct = 0;

      function finish() {
        var pass = correct / list.length >= 0.6;
        if (pass) awardModeStar(lesson.id, 'word');
        el.chBody.innerHTML = resultHtml(pass, pass ? '讀題好厲害！' : '下次先說說「求什麼」～',
          '過關 ' + correct + ' / ' + list.length + (pass ? ' · 已記下這顆 ★' : ''));
        bindResult(lesson, 'word');
      }
      function render() {
        if (i >= list.length) return finish();
        var p = list[i];
        var phase = 0; // 0 what, 1 op, 2 calc
        var hintLevel = 0;
        function paint() {
          var phases = ['① 求什麼', '② 怎麼算', '③ 算出來'];
          var pills = phases.map(function (lab, idx) {
            var cls = idx === phase ? ' is-on' : (idx < phase ? ' is-done' : '');
            return '<span class="phase-pill' + cls + '">' + lab + '</span>';
          }).join('');
          var body = '';
          if (phase === 0) {
            body = '<p class="q-sub">先想：題目要我們求什麼？</p>' +
              coachAsk('先不要急著算數字～') +
              '<div class="choices">' + shuffle(p.whatOptions || []).map(function (o) {
                return '<button type="button" class="choice" data-ok="' + (o.correct ? '1' : '0') + '">' + escapeHtml(o.text) + '</button>';
              }).join('') + '</div>';
          } else if (phase === 1) {
            body = '<p class="q-sub">接下來：該怎麼算？</p>' +
              coachAsk('選一個算式或想法') +
              '<div class="choices">' + shuffle(p.opOptions || []).map(function (o) {
                return '<button type="button" class="choice" data-ok="' + (o.correct ? '1' : '0') + '">' + escapeHtml(o.text) + '</button>';
              }).join('') + '</div>';
          } else {
            body = '<p class="q-sub">最後：算出答案</p>' +
              (p.companionAsk ? coachAsk(p.companionAsk) : '') +
              '<div id="hint-slot"></div>' +
              '<div class="answer-row">' +
                '<input type="text" id="ans" autocomplete="off" aria-label="答案" placeholder="答案" />' +
                '<button type="button" class="btn primary" id="check">試試看</button>' +
              '</div>' +
              '<div class="hint-actions"><button type="button" class="btn secondary" id="more-hint">我需要提示</button></div>';
          }
          el.chBody.innerHTML =
            '<div class="progress-bar"><span style="width:' + (i / list.length) * 100 + '%"></span></div>' +
            '<div class="q-card">' +
              '<p class="q-sub">第 ' + (i + 1) + ' / ' + list.length + ' 題</p>' +
              '<div class="phase-pills">' + pills + '</div>' +
              '<div class="story-box">' + escapeHtml(p.story) + '</div>' +
              body +
              '<p class="feedback" id="fb" aria-live="polite"></p>' +
            '</div>';
          if (phase < 2) {
            el.chBody.onclick = function (e) {
              var btn = e.target.closest('.choice');
              if (!btn || btn.disabled) return;
              var ok = btn.dataset.ok === '1';
              $$('.choice', el.chBody).forEach(function (c) {
                c.disabled = true;
                if (c.dataset.ok === '1') c.classList.add('correct');
                else if (c === btn && !ok) c.classList.add('wrong');
                else c.classList.add('dim');
              });
              var fb = $('#fb');
              if (ok) {
                fb.textContent = phase === 0 ? '對！先搞懂要求什麼。' : '對！接下來自己算算看。';
                fb.className = 'feedback ok';
                setTimeout(function () { phase++; paint(); }, 650);
              } else {
                fb.textContent = phase === 0 ? '再讀一次：它在問什麼？' : '想想是加、減、乘還是除？';
                fb.className = 'feedback no';
                setTimeout(function () {
                  $$('.choice', el.chBody).forEach(function (c) {
                    c.disabled = false; c.classList.remove('correct', 'wrong', 'dim');
                  });
                  fb.textContent = '';
                }, 900);
              }
            };
          } else {
            el.chBody.onclick = null;
            $('#more-hint').onclick = function () {
              var hints = p.hints || [];
              if (hintLevel < hints.length) hintLevel++;
              $('#hint-slot').innerHTML = hintUi(hintLevel, hints);
            };
            function submit() {
              var ok = C.answersMatch($('#ans').value, p.answers || [p.answer]);
              var fb = $('#fb');
              if (ok) {
                correct++;
                fb.textContent = '算出來了！' + (p.explain ? ' ' + p.explain : '');
                fb.className = 'feedback ok';
                setTimeout(function () { i++; render(); }, 800);
              } else {
                fb.textContent = '再試一次；過程對了，答案就會對。';
                fb.className = 'feedback no';
                if (hintLevel === 0) {
                  hintLevel = 1;
                  $('#hint-slot').innerHTML = hintUi(1, p.hints || []) + pitfallNote(p);
                }
              }
            }
            $('#check').onclick = submit;
            $('#ans').onkeydown = function (e) { if (e.key === 'Enter') submit(); };
            $('#ans').focus();
          }
        }
        paint();
      }
      render();
    }

    // ---- 找出錯哪一行 ----
    function runError(lesson, pool) {
      var list = shuffle(pool).slice(0, Math.min(4, pool.length));
      var i = 0, correct = 0;
      function finish() {
        var pass = correct / list.length >= 0.6;
        if (pass) awardModeStar(lesson.id, 'error');
        el.chBody.innerHTML = resultHtml(pass, pass ? '火眼金睛！' : '找錯很不容易，再練練！',
          '過關 ' + correct + ' / ' + list.length + (pass ? ' · 已記下這顆 ★' : ''));
        bindResult(lesson, 'error');
      }
      function render() {
        if (i >= list.length) return finish();
        var p = list[i];
        var locked = false;
        el.chBody.innerHTML =
          '<div class="progress-bar"><span style="width:' + (i / list.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            '<p class="q-sub">第 ' + (i + 1) + ' / ' + list.length + ' 題 · 找過程哪裡錯</p>' +
            coachAsk('正確答案應該是 ' + (p.correctAnswer || '？') + '。哪一步想錯了？') +
            '<div class="math-expression">' + escapeHtml(p.expression || '') + '</div>' +
            '<p class="q-prompt" style="font-size:1.05rem">' + escapeHtml(p.title || '哪一行錯了？') + '</p>' +
            '<div class="math-steps">' + (p.lines || []).map(function (line, idx) {
              return '<div class="math-step" data-idx="' + idx + '">' +
                '<span class="n">' + (idx + 1) + '</span>' +
                '<span>' + escapeHtml(line.text) + '</span>' +
                '<button type="button" class="pick-line" data-idx="' + idx + '">是這裡</button>' +
              '</div>';
            }).join('') + '</div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
            '<div id="why"></div>' +
          '</div>';
        el.chBody.onclick = function (e) {
          var btn = e.target.closest('.pick-line');
          if (!btn || locked) return;
          locked = true;
          var idx = Number(btn.dataset.idx);
          var ok = idx === p.wrongIndex;
          var steps = $$('.math-step', el.chBody);
          steps.forEach(function (s) {
            var si = Number(s.dataset.idx);
            if (si === p.wrongIndex) s.classList.add('is-bad');
            else if (si === idx && !ok) s.classList.add('is-bad');
            else if ((p.lines[si] || {}).ok) s.classList.add('is-ok');
          });
          var fb = $('#fb');
          var why = $('#why');
          var wrongLine = p.lines[p.wrongIndex] || {};
          if (ok) {
            correct++;
            fb.textContent = '找對了！'; fb.className = 'feedback ok';
            why.innerHTML = '<div class="why-box">' + escapeHtml(wrongLine.why || p.why || '') +
              (p.why && wrongLine.why !== p.why ? '<br/>' + escapeHtml(p.why) : '') + '</div>';
            setTimeout(function () { i++; render(); }, 1200);
          } else {
            fb.textContent = '不是這一行。看看標起來的那一步為什麼錯。';
            fb.className = 'feedback no';
            why.innerHTML = '<div class="why-box">' + escapeHtml(wrongLine.why || p.why || '') + '</div>';
            setTimeout(function () { i++; render(); }, 1600);
          }
        };
      }
      render();
    }

    // ---- 小小複習 ----
    function runRecap(lesson, pack) {
      var qs = (pack && pack.questions) || [];
      var i = 0, correct = 0, hintLevel = 0, locked = false;
      function finish() {
        var pass = qs.length && correct / qs.length >= 0.6;
        if (pass) awardModeStar(lesson.id, 'recap');
        el.chBody.innerHTML = resultHtml(pass, pass ? '複習完成！' : '回家再看一眼今天的重點～',
          '答對 ' + correct + ' / ' + qs.length + (pass ? ' · 已記下這顆 ★' : '') +
          '<br/><span style="font-size:.9rem">今天記得：先想過程，再寫答案。</span>');
        bindResult(lesson, 'recap');
      }
      function render() {
        if (i >= qs.length) return finish();
        locked = false; hintLevel = 0;
        var q = qs[i];
        el.chBody.innerHTML =
          '<div class="progress-bar"><span style="width:' + (i / qs.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            '<p class="q-sub">小小複習 ' + (i + 1) + ' / ' + qs.length + '</p>' +
            coachAsk('用一句話跟小夥伴說：你打算怎麼算？') +
            '<p class="q-prompt">' + escapeHtml(q.q) + '</p>' +
            '<div id="hint-slot"></div>' +
            '<div class="answer-row">' +
              '<input type="text" id="ans" autocomplete="off" aria-label="答案" placeholder="答案" />' +
              '<button type="button" class="btn primary" id="check">試試看</button>' +
            '</div>' +
            '<div class="hint-actions"><button type="button" class="btn secondary" id="more-hint">提示一下</button></div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
          '</div>';
        $('#more-hint').onclick = function () {
          hintLevel = Math.min(hintLevel + 1, 2);
          var hints = [q.tip || '再想一想', '答案是 ' + q.a];
          $('#hint-slot').innerHTML = hintUi(hintLevel, hints);
        };
        function submit() {
          if (locked) return;
          var ok = C.answersMatch($('#ans').value, q.answers || [q.a]);
          locked = true;
          var fb = $('#fb');
          if (ok) {
            correct++;
            fb.textContent = '記住了！'; fb.className = 'feedback ok';
            setTimeout(function () { i++; render(); }, 600);
          } else {
            fb.textContent = '差一點，看提示再試。'; fb.className = 'feedback no';
            locked = false;
            if (!hintLevel) {
              hintLevel = 1;
              $('#hint-slot').innerHTML = hintUi(1, [q.tip || '再想一想', '答案是 ' + q.a]);
            }
          }
        }
        $('#check').onclick = submit;
        $('#ans').onkeydown = function (e) { if (e.key === 'Enter') submit(); };
        $('#ans').focus();
      }
      render();
    }


    function problemsFor(lesson, mode) {
      return (lesson.problems || []).filter(function (p) { return p.kind === mode; });
    }

    function startMode(lesson, mode) {
      var pool = problemsFor(lesson, mode);
      if (!pool.length) {
        el.chBody.innerHTML = '<p class="feedback no">這一關還沒有題目。</p>';
        return;
      }
      if (mode === 'recap') runRecap(lesson, pool[0]);
      else if (mode === 'error') runError(lesson, pool);
      else if (mode === 'word') runWord(lesson, pool);
      else if (mode === 'visual') runVisual(lesson, pool);
      else runScaffold(lesson, pool);
    }

    return { startMode: startMode };
  }

  window.IslesSubject.boot({
    subject: 'math',
    data: DATA,
    loadError: '資料載入失敗，請確認 assets/ 裡的 math-data.js、core.js、companions.js、ui.js、subject.js 都在。',
    titleSuffix: '國小數學群島',
    legacyHash: false,
    sailOnIslandClick: false,
    unitListUsesHash: false,
    gradeBuddy: ['', 'pebble', 'chirp', 'sprout', 'drop', 'luna', 'ember'],
    track: function (g) {
      return g === 6 ? { text: '衔接國中', cls: 'bridge' } : { text: '課綱進度', cls: '' };
    },
    hubMeta: function (rm) {
      var meta = (rm.focus || '').slice(0, 28) + ((rm.focus || '').length > 28 ? '…' : '');
      return window.IslesCore.escapeHtml(meta);
    },
    routeLead: function (rm) {
      return (rm.focus || '一步一步想，卡住了還有提示。') + ' 選一座島，或從下面挑一關。';
    },
    lessonIcon: function (L, isl) {
      return L.review ? '🔁' : isl.symbol;
    },
    islandHi: function (buddy) {
      var lines = {
        pebble: '先數清楚，再開始算！',
        chirp: '卡住了？我們一步一步來！',
        ember: '題目在問什麼？先說給我聽～',
        sprout: '圖形也有小秘密喔！',
        drop: '單位看清楚了嗎？',
        luna: '分數小數，慢慢想就好。',
        swirl: '複習一下，會更厲害！'
      };
      return lines[buddy.id] || '一起想一想！';
    },
    challengeKicker: function () { return '數學挑戰'; },
    resetButtonLabel: function (label) { return '重置「' + label + '」進度'; },
    resetConfirm: function (label) {
      return '確定要清空「' + label + '」的星星嗎？（英文進度不會被清掉）';
    },
    play: mathPlay
  });
})();
