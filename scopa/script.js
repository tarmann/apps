const playersKey = 'scopa_players';

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
  document.getElementById('p1-name').textContent = players[0].name;
  document.getElementById('p2-name').textContent = players[1].name;

  const body = document.getElementById('score-body');
  body.innerHTML = '';
  const categories = ['cards', 'coins', 'settebello', 'primiera', 'scopa'];
  const labels = {
    cards: 'Cards',
    coins: 'Coins',
    settebello: 'Settebello',
    primiera: 'Primiera',
    scopa: 'Scopa'
  };

  categories.forEach(cat => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="border px-2 py-1">${labels[cat]}</td>
      <td class="border px-2 py-1">${players[0][cat]}</td>
      <td class="border px-2 py-1">${players[1][cat]}</td>`;
    body.appendChild(tr);
  });

  document.getElementById('p1-total').textContent = players[0].total;
  document.getElementById('p2-total').textContent = players[1].total;
}

function startGame() {
  const name1 = document.getElementById('player1').value.trim() || 'Player 1';
  const name2 = document.getElementById('player2').value.trim() || 'Player 2';
  const players = [
    { name: name1, cards: 0, coins: 0, settebello: 0, primiera: 0, scopa: 0, total: 0 },
    { name: name2, cards: 0, coins: 0, settebello: 0, primiera: 0, scopa: 0, total: 0 }
  ];
  saveGame(players);
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-area').classList.remove('hidden');
  renderScores(players);
}

function addRound(players) {
  const fields = ['cards', 'coins', 'settebello', 'primiera', 'scopa'];
  fields.forEach(field => {
    const p1Val = parseInt(document.getElementById(`p1-${field}`).value, 10) || 0;
    const p2Val = parseInt(document.getElementById(`p2-${field}`).value, 10) || 0;
    players[0][field] += p1Val;
    players[1][field] += p2Val;
    players[0].total += p1Val;
    players[1].total += p2Val;
    document.getElementById(`p1-${field}`).value = 0;
    document.getElementById(`p2-${field}`).value = 0;
  });
  saveGame(players);
  renderScores(players);
}

function setup() {
  const storedPlayers = loadGame();
  const startScreen = document.getElementById('start-screen');
  const gameArea = document.getElementById('game-area');
  const roundForm = document.getElementById('round-form');

  let players = storedPlayers || null;
  if (players) {
    startScreen.classList.add('hidden');
    gameArea.classList.remove('hidden');
    renderScores(players);
  }

  document.getElementById('start-btn').addEventListener('click', () => {
    players = [
      { name: document.getElementById('player1').value.trim() || 'Player 1', cards: 0, coins: 0, settebello: 0, primiera: 0, scopa: 0, total: 0 },
      { name: document.getElementById('player2').value.trim() || 'Player 2', cards: 0, coins: 0, settebello: 0, primiera: 0, scopa: 0, total: 0 }
    ];
    saveGame(players);
    startScreen.classList.add('hidden');
    gameArea.classList.remove('hidden');
    renderScores(players);
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
