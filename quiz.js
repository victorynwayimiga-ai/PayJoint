const STORAGE_KEY = 'waec-jamb-quiz-v1';
const SECONDS_PER_QUESTION = 60;
const LETTERS = ['A', 'B', 'C', 'D'];

const $ = (id) => document.getElementById(id);

let session = null;
let timerId = null;
let lastSettings = null;

/* ---------- helpers ---------- */
function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
}

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pad(n) { return String(n).padStart(2, '0'); }

function formatClock(totalSeconds) {
    const s = Math.max(0, totalSeconds);
    return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

function showScreen(name) {
    $('setupScreen').hidden = name !== 'setup';
    $('quizScreen').hidden = name !== 'quiz';
    $('resultScreen').hidden = name !== 'result';
    window.scrollTo({ top: 0 });
}

function loadHistory() {
    try {
        const h = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(h) ? h : [];
    } catch (e) {
        return [];
    }
}

function saveHistory(list) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) { /* storage unavailable, ignore */ }
}

/* ---------- question pool ---------- */
function subjectNames() { return Object.keys(QUESTIONS); }

function buildPool(subject) {
    const names = subject === 'All' ? subjectNames() : [subject];
    const pool = [];
    names.forEach((name) => {
        QUESTIONS[name].forEach((q) => pool.push(Object.assign({ subject: name }, q)));
    });
    return pool;
}

/* ---------- setup screen ---------- */
function buildSetup() {
    const sel = $('subjectSelect');
    sel.textContent = '';

    const total = buildPool('All').length;
    const all = el('option', '', `All subjects, mixed (${total})`);
    all.value = 'All';
    sel.appendChild(all);

    subjectNames().forEach((name) => {
        const o = el('option', '', `${name} (${QUESTIONS[name].length})`);
        o.value = name;
        sel.appendChild(o);
    });

    renderHistory();
}

function renderHistory() {
    const history = loadHistory();
    const list = $('historyList');
    list.textContent = '';
    $('noHistory').hidden = history.length > 0;
    $('clearHistoryBtn').hidden = history.length === 0;

    // best score per subject
    const best = {};
    history.forEach((h) => {
        if (!best[h.subject] || h.percent > best[h.subject]) best[h.subject] = h.percent;
    });
    const bestBox = $('bestBox');
    bestBox.textContent = '';
    Object.keys(best).forEach((subject) => {
        const chip = el('span', 'chip', `${subject === 'All' ? 'Mixed' : subject}: best ${best[subject]}%`);
        bestBox.appendChild(chip);
    });

    history.slice(-8).reverse().forEach((h) => {
        const li = el('li', 'hist');
        const left = el('div');
        left.appendChild(el('strong', '', h.subject === 'All' ? 'Mixed subjects' : h.subject));
        left.appendChild(el('small', '', `${h.date} • ${h.mode === 'exam' ? 'Exam' : 'Practice'}${h.timed ? ' • Timed' : ''}`));
        const right = el('div', 'hist-score ' + gradeClass(h.percent), `${h.correct}/${h.total} (${h.percent}%)`);
        li.append(left, right);
        list.appendChild(li);
    });
}

function gradeClass(percent) {
    if (percent >= 70) return 'good';
    if (percent >= 50) return 'ok';
    return 'low';
}

$('clearHistoryBtn').addEventListener('click', function () {
    if (!confirm('Clear all your saved quiz history?')) return;
    saveHistory([]);
    renderHistory();
});

$('startBtn').addEventListener('click', function () {
    const countValue = $('countSelect').value;
    startQuiz({
        subject: $('subjectSelect').value,
        count: countValue === 'all' ? Infinity : Number(countValue),
        mode: document.querySelector('input[name="mode"]:checked').value,
        timed: $('timedBox').checked
    });
});

/* ---------- quiz ---------- */
function startQuiz(settings) {
    lastSettings = settings;
    const pool = shuffle(buildPool(settings.subject));
    const questions = pool.slice(0, Math.min(settings.count, pool.length));

    if (questions.length === 0) {
        alert('No questions available for this subject.');
        return;
    }

    session = {
        settings: settings,
        questions: questions,
        answers: new Array(questions.length).fill(null),
        index: 0,
        startedAt: Date.now(),
        endAt: settings.timed ? Date.now() + questions.length * SECONDS_PER_QUESTION * 1000 : null,
        finished: false
    };

    showScreen('quiz');
    $('subjectTag').textContent = settings.subject === 'All' ? 'Mixed' : settings.subject;
    renderQuestion();
    startTimer();
}

function startTimer() {
    stopTimer();
    const timer = $('timer');
    if (!session.endAt) {
        timer.hidden = true;
        return;
    }
    timer.hidden = false;

    const tick = function () {
        const remaining = Math.ceil((session.endAt - Date.now()) / 1000);
        timer.textContent = formatClock(remaining);
        timer.classList.toggle('warn', remaining <= 60);
        if (remaining <= 0) {
            stopTimer();
            alert("Time is up! Your quiz will now be submitted.");
            finishQuiz(true);
        }
    };
    tick();
    timerId = setInterval(tick, 1000);
}

function stopTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}

function renderQuestion() {
    const s = session;
    const q = s.questions[s.index];
    const answered = s.answers[s.index] !== null;
    const practice = s.settings.mode === 'practice';

    $('progressText').textContent = `Question ${s.index + 1} of ${s.questions.length}`;
    $('barFill').style.width = ((s.index + 1) / s.questions.length) * 100 + '%';
    $('questionText').textContent = q.q;

    if (s.settings.subject === 'All') $('subjectTag').textContent = q.subject;

    // options
    const box = $('optionsBox');
    box.textContent = '';
    q.options.forEach((text, i) => {
        const btn = el('button', 'option');
        btn.type = 'button';
        btn.append(el('span', 'letter', LETTERS[i]), el('span', 'opt-text', text));

        if (s.answers[s.index] === i) btn.classList.add('selected');

        if (practice && answered) {
            btn.disabled = true;
            if (i === q.answer) btn.classList.add('correct');
            else if (i === s.answers[s.index]) btn.classList.add('wrong');
        }

        btn.addEventListener('click', () => choose(i));
        box.appendChild(btn);
    });

    // feedback (practice mode only)
    const fb = $('feedback');
    if (practice && answered) {
        const isRight = s.answers[s.index] === q.answer;
        fb.hidden = false;
        fb.className = 'feedback ' + (isRight ? 'good' : 'bad');
        fb.textContent = '';
        fb.appendChild(el('strong', '', isRight ? 'Correct!' : `Not quite. The correct answer is ${LETTERS[q.answer]}: ${q.options[q.answer]}`));
        fb.appendChild(el('p', '', q.explain));
    } else {
        fb.hidden = true;
    }

    // navigation
    $('prevBtn').disabled = s.index === 0;
    $('nextBtn').textContent = s.index === s.questions.length - 1 ? 'Finish ✓' : 'Next →';

    renderPalette();
}

function renderPalette() {
    const s = session;
    const practice = s.settings.mode === 'practice';
    const pal = $('palette');
    pal.textContent = '';

    s.questions.forEach((q, i) => {
        const b = el('button', 'pal', String(i + 1));
        b.type = 'button';
        if (i === s.index) b.classList.add('current');
        if (s.answers[i] !== null) {
            b.classList.add('answered');
            if (practice) b.classList.add(s.answers[i] === q.answer ? 'right' : 'miss');
        }
        b.addEventListener('click', () => {
            s.index = i;
            renderQuestion();
        });
        pal.appendChild(b);
    });
}

function choose(i) {
    const s = session;
    if (!s || s.finished) return;
    if (s.settings.mode === 'practice' && s.answers[s.index] !== null) return;
    s.answers[s.index] = i;
    renderQuestion();
}

$('prevBtn').addEventListener('click', function () {
    if (session.index > 0) {
        session.index -= 1;
        renderQuestion();
    }
});

$('nextBtn').addEventListener('click', function () {
    if (session.index < session.questions.length - 1) {
        session.index += 1;
        renderQuestion();
    } else {
        finishQuiz(false);
    }
});

$('submitBtn').addEventListener('click', function () { finishQuiz(false); });

$('quitBtn').addEventListener('click', function () {
    if (!confirm('Quit this quiz? Your progress will be lost.')) return;
    stopTimer();
    session = null;
    showScreen('setup');
    renderHistory();
});

/* ---------- finish & results ---------- */
function finishQuiz(auto) {
    const s = session;
    if (!s || s.finished) return;

    const unanswered = s.answers.filter((a) => a === null).length;
    if (!auto && unanswered > 0) {
        if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
    }

    s.finished = true;
    stopTimer();

    const total = s.questions.length;
    const correct = s.questions.filter((q, i) => s.answers[i] === q.answer).length;
    const percent = Math.round((correct / total) * 100);
    const seconds = Math.round((Date.now() - s.startedAt) / 1000);

    // save to history
    const history = loadHistory();
    history.push({
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        subject: s.settings.subject,
        mode: s.settings.mode,
        timed: s.settings.timed,
        correct: correct,
        total: total,
        percent: percent
    });
    saveHistory(history.slice(-30));

    showResult(correct, total, percent, seconds);
}

function showResult(correct, total, percent, seconds) {
    showScreen('result');

    $('scorePercent').textContent = percent + '%';
    $('scoreCircle').className = 'score-circle ' + gradeClass(percent);
    $('scoreText').textContent = `${correct} out of ${total} correct • Time: ${formatClock(seconds)}`;
    $('scoreMessage').textContent =
        percent >= 70 ? 'Excellent work! Keep it up.'
        : percent >= 50 ? 'Good effort. Review the mistakes below and try again.'
        : 'Keep practising. Read the explanations below, then retry.';

    $('onlyWrong').checked = false;
    renderReview();
}

function renderReview() {
    const s = session;
    const onlyWrong = $('onlyWrong').checked;
    const list = $('reviewList');
    list.textContent = '';

    let shown = 0;
    s.questions.forEach((q, i) => {
        const given = s.answers[i];
        const isRight = given === q.answer;
        const skipped = given === null;
        if (onlyWrong && isRight) return;
        shown += 1;

        const item = el('div', 'review ' + (isRight ? 'right' : skipped ? 'skipped' : 'wrong'));

        const head = el('div', 'review-head');
        head.appendChild(el('strong', '', `Q${i + 1}. ${q.q}`));
        head.appendChild(el('span', 'badge', isRight ? 'Correct' : skipped ? 'Skipped' : 'Wrong'));
        item.appendChild(head);

        item.appendChild(el('p', 'yours',
            'Your answer: ' + (skipped ? 'none' : `${LETTERS[given]}. ${q.options[given]}`)));
        if (!isRight) item.appendChild(el('p', 'right-ans', `Correct answer: ${LETTERS[q.answer]}. ${q.options[q.answer]}`));
        item.appendChild(el('p', 'why', q.explain));

        list.appendChild(item);
    });

    if (shown === 0) {
        list.appendChild(el('p', 'empty', 'Perfect! You got every question right.'));
    }
}

$('onlyWrong').addEventListener('change', renderReview);

$('retryBtn').addEventListener('click', function () {
    if (lastSettings) startQuiz(lastSettings);
});

$('homeBtn').addEventListener('click', function () {
    session = null;
    showScreen('setup');
    renderHistory();
});

/* ---------- start ---------- */
buildSetup();
showScreen('setup');