const playersKey = 'scopa_players';
const labels = {
  cards: 'Cards',
  coins: 'Coins',
  settebello: 'Settebello',
  primiera: 'Primiera',
  scopa: 'Scopa'
};

function loadGame() {
  const stored = localStorage.getItem(playersKey);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}

function saveGame(data) {
  localStorage.setItem(playersKey, JSON.stringify(data));
}

function renderScores(players) {
  const header = document.getElementById('score-header');
  header.innerHTML = '<th class="px-2 py-1">Category</th>';
  players.forEach(p => {
    header.innerHTML += `<th class="px-2 py-1">${p.name}</th>`;
  });

  const body = document.getElementById('score-body');
  body.innerHTML = '';
  const categories = ['cards', 'coins', 'settebello', 'primiera', 'scopa'];

  categories.forEach(cat => {
    const tr = document.createElement('tr');
    let row = `<td class="border px-2 py-1">${labels[cat]}</td>`;
    players.forEach(p => {
      row += `<td class="border px-2 py-1">${p[cat]}</td>`;
    });
    tr.innerHTML = row;
    body.appendChild(tr);
  });

  const totalRow = document.getElementById('score-total-row');
  totalRow.innerHTML = '<td class="px-2 py-1">Total</td>';
  players.forEach(p => {
    totalRow.innerHTML += `<td class="px-2 py-1">${p.total}</td>`;
  });
}

function buildRoundForm(players) {
  const container = document.getElementById('round-fields');
  container.innerHTML = '';
  const winnerCats = ['cards', 'coins', 'settebello', 'primiera'];

  winnerCats.forEach(cat => {
    const div = document.createElement('div');
    div.className = 'grid grid-cols-2 gap-2 items-center';
    div.innerHTML = `<label>${labels[cat]}</label>`;

    const select = document.createElement('select');
    select.id = `${cat}-winner`;
    select.className = 'border p-1';
    const noneOption = document.createElement('option');
    noneOption.value = '';
    noneOption.textContent = 'None';
    select.appendChild(noneOption);
    players.forEach((p, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = p.name;
      select.appendChild(opt);
    });
    div.appendChild(select);
    container.appendChild(div);
  });

  const scopaDiv = document.createElement('div');
  scopaDiv.className = 'grid gap-2 items-center';
  scopaDiv.style.gridTemplateColumns = `repeat(${players.length + 1}, minmax(0, 1fr))`;
  scopaDiv.appendChild(document.createElement('label')).textContent = labels.scopa;
  players.forEach((p, i) => {
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `p${i + 1}-scopa`;
    input.value = 0;
    input.className = 'border p-1';
    scopaDiv.appendChild(input);
  });
  container.appendChild(scopaDiv);
}

function startGame(count) {
  const players = [];
  for (let i = 1; i <= count; i++) {
    const name = document.getElementById(`player${i}`).value.trim() || `Player ${i}`;
    players.push({ name, cards: 0, coins: 0, settebello: 0, primiera: 0, scopa: 0, total: 0 });
  }
  saveGame(players);
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-area').classList.remove('hidden');
  buildRoundForm(players);
  renderScores(players);
  return players;
}

function addRound(players) {
  const winnerCats = ['cards', 'coins', 'settebello', 'primiera'];
  winnerCats.forEach(cat => {
    const val = document.getElementById(`${cat}-winner`).value;
    if (val !== '') {
      const idx = parseInt(val, 10);
      players[idx][cat] += 1;
      players[idx].total += 1;
    }
    document.getElementById(`${cat}-winner`).value = '';
  });

  players.forEach((p, i) => {
    const val = parseInt(document.getElementById(`p${i + 1}-scopa`).value, 10) || 0;
    p.scopa += val;
    p.total += val;
    document.getElementById(`p${i + 1}-scopa`).value = 0;
  });

  saveGame(players);
  renderScores(players);
}

function setup() {
  const storedPlayers = loadGame();
  const startScreen = document.getElementById('start-screen');
  const gameArea = document.getElementById('game-area');
  const roundForm = document.getElementById('round-form');
  const numSelect = document.getElementById('num-players');

  numSelect.addEventListener('change', () => {
    const count = parseInt(numSelect.value, 10);
    for (let i = 3; i <= 4; i++) {
      document.getElementById(`player${i}-field`).classList.toggle('hidden', i > count);
    }
  });

  let players = storedPlayers || null;
  if (players) {
    startScreen.classList.add('hidden');
    gameArea.classList.remove('hidden');
    buildRoundForm(players);
    renderScores(players);
  } else {
    numSelect.dispatchEvent(new Event('change'));
  }

  document.getElementById('start-btn').addEventListener('click', () => {
    const count = parseInt(numSelect.value, 10);
    players = startGame(count);
  });

  document.getElementById('add-round').addEventListener('click', () => {
    roundForm.classList.remove('hidden');
  });

  document.getElementById('cancel-round').addEventListener('click', () => {
    roundForm.classList.add('hidden');
  });

  document.getElementById('save-round').addEventListener('click', () => {
    if (!players) return;
    addRound(players);
    roundForm.classList.add('hidden');
  });

  document.getElementById('clear-btn').addEventListener('click', () => {
    localStorage.removeItem(playersKey);
    location.reload();
  });
}

document.addEventListener('DOMContentLoaded', setup);
