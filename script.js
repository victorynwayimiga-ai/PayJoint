const STORAGE_KEY = 'ajo-esusu-v1';

const $ = (id) => document.getElementById(id);

let state = loadState();

/* ---------- storage ---------- */
function loadState() {
    try {
        const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (s && Array.isArray(s.groups)) return s;
    } catch (e) { /* ignore */ }
    return { groups: [], activeId: null };
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        alert('Could not save data. Your browser storage may be full or blocked.');
    }
}

/* ---------- helpers ---------- */
function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function naira(n) {
    return '₦' + Number(n).toLocaleString('en-NG');
}

function pad(n) { return String(n).padStart(2, '0'); }

function toDateString(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function todayString() { return toDateString(new Date()); }

// payout date for round k (0-based) = start date + k periods
function roundDate(group, k) {
    const d = new Date(group.startDate + 'T00:00:00');
    if (group.frequency === 'daily') d.setDate(d.getDate() + k);
    else if (group.frequency === 'weekly') d.setDate(d.getDate() + 7 * k);
    else d.setMonth(d.getMonth() + k);
    return d;
}

function formatDate(d) {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function toInternational(phone) {
    const p = String(phone).replace(/\D/g, '');
    if (p.startsWith('234')) return p;
    if (p.startsWith('0')) return '234' + p.slice(1);
    return p;
}

function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
}

function makeButton(label, cls, handler) {
    const b = el('button', cls, label);
    b.type = 'button';
    b.addEventListener('click', handler);
    return b;
}

function activeGroup() {
    return state.groups.find((g) => g.id === state.activeId) || null;
}

function freqLabel(f) {
    return f === 'daily' ? 'daily' : f === 'weekly' ? 'weekly' : 'monthly';
}

/* ---------- create group ---------- */
$('groupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = $('gName').value.trim();
    const amount = Number($('gAmount').value);

    if (name === '' || !amount || amount <= 0) {
        alert('Please enter a group name and a contribution amount greater than zero.');
        return;
    }

    const group = {
        id: uid(),
        name: name,
        amount: amount,
        frequency: $('gFreq').value,
        startDate: $('gStart').value || todayString(),
        members: [],
        started: false,
        complete: false,
        round: 0,
        cycle: 1,
        paid: {},
        history: []
    };

    state.groups.push(group);
    state.activeId = group.id;
    saveState();

    $('gName').value = '';
    $('gAmount').value = '';
    $('newGroupDetails').open = false;
    render();
});

$('groupSelect').addEventListener('change', function () {
    state.activeId = this.value;
    saveState();
    render();
});

$('deleteGroupBtn').addEventListener('click', function () {
    const g = activeGroup();
    if (!g) return;
    if (!confirm(`Delete "${g.name}" and all its records? This cannot be undone.`)) return;
    state.groups = state.groups.filter((x) => x.id !== g.id);
    state.activeId = state.groups.length ? state.groups[0].id : null;
    saveState();
    render();
});

/* ---------- members ---------- */
$('memberForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const g = activeGroup();
    if (!g || g.started) return;

    const name = $('mName').value.trim();
    if (name === '') {
        alert('Please enter the member name.');
        return;
    }
    if (g.members.some((m) => m.name.toLowerCase() === name.toLowerCase())) {
        alert('A member with this name already exists. Add a surname or nickname to tell them apart.');
        return;
    }

    g.members.push({ id: uid(), name: name, phone: $('mPhone').value.trim() });
    saveState();
    $('mName').value = '';
    $('mPhone').value = '';
    $('mName').focus();
    render();
});

function moveMember(index, dir) {
    const g = activeGroup();
    const j = index + dir;
    if (!g || g.started || j < 0 || j >= g.members.length) return;
    [g.members[index], g.members[j]] = [g.members[j], g.members[index]];
    saveState();
    render();
}

function removeMember(index) {
    const g = activeGroup();
    if (!g || g.started) return;
    g.members.splice(index, 1);
    saveState();
    render();
}

$('shuffleBtn').addEventListener('click', function () {
    const g = activeGroup();
    if (!g || g.started || g.members.length < 2) return;
    for (let i = g.members.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [g.members[i], g.members[j]] = [g.members[j], g.members[i]];
    }
    saveState();
    render();
});

$('startBtn').addEventListener('click', function () {
    const g = activeGroup();
    if (!g || g.started) return;
    if (g.members.length < 2) {
        alert('You need at least 2 members to start.');
        return;
    }
    if (!confirm('Start the Ajo? The payout order will be locked.')) return;
    g.started = true;
    g.complete = false;
    g.round = 0;
    g.paid = {};
    saveState();
    render();
});

/* ---------- payments ---------- */
function togglePaid(memberId) {
    const g = activeGroup();
    if (!g || !g.started || g.complete) return;
    if (g.paid[memberId]) delete g.paid[memberId];
    else g.paid[memberId] = true;
    saveState();
    render();
}

function sendReminder(member) {
    const g = activeGroup();
    const due = formatDate(roundDate(g, g.round));
    const text = `Hello ${member.name}, a friendly reminder: your ${naira(g.amount)} contribution for "${g.name}" (round ${g.round + 1}, payout date ${due}) is still pending. Thank you!`;
    const base = member.phone ? `https://wa.me/${toInternational(member.phone)}` : 'https://wa.me/';
    window.open(`${base}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}

$('payoutBtn').addEventListener('click', function () {
    const g = activeGroup();
    if (!g || !g.started || g.complete) return;

    const paidCount = g.members.filter((m) => g.paid[m.id]).length;
    const recipient = g.members[g.round];

    if (paidCount < g.members.length) {
        const missing = g.members.length - paidCount;
        if (!confirm(`${missing} member(s) have not paid yet. Record the payout anyway?`)) return;
    }

    g.history.push({
        cycle: g.cycle,
        round: g.round + 1,
        recipient: recipient.name,
        amount: paidCount * g.amount,
        expected: g.members.length * g.amount,
        date: todayString()
    });

    g.round += 1;
    g.paid = {};
    if (g.round >= g.members.length) g.complete = true;

    saveState();
    render();
});

$('newCycleBtn').addEventListener('click', function () {
    const g = activeGroup();
    if (!g || !g.complete) return;
    if (!confirm('Start a new cycle? Members stay the same and the payout order restarts.')) return;
    g.cycle += 1;
    g.started = false;
    g.complete = false;
    g.round = 0;
    g.paid = {};
    g.startDate = todayString();
    saveState();
    render();
});

/* ---------- render ---------- */
function renderGroupSelect() {
    const sel = $('groupSelect');
    sel.textContent = '';
    state.groups.forEach((g) => {
        const o = el('option', '', g.name);
        o.value = g.id;
        if (g.id === state.activeId) o.selected = true;
        sel.appendChild(o);
    });
}

function renderMembers(g) {
    const list = $('memberList');
    list.textContent = '';
    $('noMembers').hidden = g.members.length > 0;

    g.members.forEach((m, i) => {
        const li = el('li', 'member');
        const status = !g.started ? 'waiting'
            : i < g.round ? 'received'
            : i === g.round && !g.complete ? 'current'
            : g.complete ? 'received' : 'waiting';
        li.classList.add(status);

        const order = el('span', 'order', String(i + 1));

        const info = el('div', 'info');
        info.appendChild(el('strong', '', m.name));
        const meta = [];
        if (g.started || g.members.length) meta.push('Payout: ' + formatDate(roundDate(g, i)));
        if (m.phone) meta.push(m.phone);
        info.appendChild(el('small', '', meta.join(' • ')));

        const right = el('div', 'btns');

        if (!g.started) {
            right.append(
                makeButton('↑', 'small', () => moveMember(i, -1)),
                makeButton('↓', 'small', () => moveMember(i, 1)),
                makeButton('Remove', 'small danger', () => removeMember(i))
            );
        } else {
            const badge = el('span', 'badge ' + status,
                status === 'received' ? 'Received' : status === 'current' ? 'Collecting now' : 'Waiting');
            right.appendChild(badge);

            if (!g.complete) {
                const hasPaid = !!g.paid[m.id];
                right.append(
                    makeButton(hasPaid ? 'Paid ✓' : 'Mark paid', 'small ' + (hasPaid ? 'ok' : 'warn'), () => togglePaid(m.id))
                );
                if (!hasPaid) right.append(makeButton('Remind', 'small', () => sendReminder(m)));
            }
        }

        li.append(order, info, right);
        list.appendChild(li);
    });
}

function renderHistory(g) {
    const list = $('historyList');
    list.textContent = '';
    $('noHistory').hidden = g.history.length > 0;

    g.history.slice().reverse().forEach((h) => {
        const li = el('li', 'history');
        li.appendChild(el('strong', '', `${h.recipient} collected ${naira(h.amount)}`));
        const short = h.amount < h.expected ? ` (short by ${naira(h.expected - h.amount)})` : '';
        li.appendChild(el('small', '', `Cycle ${h.cycle}, round ${h.round} • ${formatDate(new Date(h.date + 'T00:00:00'))}${short}`));
        list.appendChild(li);
    });
}

function render() {
    const g = activeGroup();
    renderGroupSelect();

    $('noGroup').hidden = !!g;
    $('detail').hidden = !g;
    $('groupSelect').parentElement.querySelector('label').hidden = state.groups.length === 0;
    $('groupSelect').hidden = state.groups.length === 0;
    if (!g) {
        $('newGroupDetails').open = true;
        return;
    }

    const n = g.members.length;
    const pot = n * g.amount;

    $('groupTitle').textContent = g.name;
    $('groupMeta').textContent = `${naira(g.amount)} per person, paid ${freqLabel(g.frequency)} • Cycle ${g.cycle}`;
    $('stMembers').textContent = n;
    $('stPot').textContent = naira(pot);

    const banner = $('roundBanner');
    const progressWrap = $('progressWrap');
    const payoutBtn = $('payoutBtn');

    $('setupPanel').hidden = g.started;
    $('membersTitle').textContent = g.started ? 'This round' : 'Members and payout order';
    payoutBtn.hidden = true;
    $('newCycleBtn').hidden = true;
    banner.hidden = true;
    progressWrap.hidden = true;

    if (!g.started) {
        $('stRound').textContent = 'Not started';
        $('stDue').textContent = '-';
    } else if (g.complete) {
        $('stRound').textContent = `${n} of ${n}`;
        $('stDue').textContent = 'Done';
        banner.hidden = false;
        banner.className = 'banner done';
        banner.textContent = 'Cycle complete! Everyone has collected once.';
        $('newCycleBtn').hidden = false;
    } else {
        const recipient = g.members[g.round];
        const paidCount = g.members.filter((m) => g.paid[m.id]).length;
        const collected = paidCount * g.amount;

        $('stRound').textContent = `${g.round + 1} of ${n}`;
        $('stDue').textContent = formatDate(roundDate(g, g.round));

        banner.hidden = false;
        banner.className = 'banner';
        banner.textContent = `${recipient.name} collects this round: ${naira(pot)}`;

        progressWrap.hidden = false;
        $('progressBar').style.width = (n ? (paidCount / n) * 100 : 0) + '%';
        $('progressText').textContent = `${paidCount} of ${n} paid • ${naira(collected)} of ${naira(pot)} collected`;

        payoutBtn.hidden = false;
        payoutBtn.textContent = `Pay out ${recipient.name} and start next round`;
    }

    $('startBtn').disabled = n < 2;
    $('shuffleBtn').disabled = n < 2;

    renderMembers(g);
    renderHistory(g);
}

/* ---------- start ---------- */
$('gStart').value = todayString();
render();