// DOM refs
const refs = {
    scores: [null,
      document.getElementById('score1'),
      document.getElementById('score2')
    ],
    serves: [null,
      document.getElementById('serve1'),
      document.getElementById('serve2')
    ],
    names: [null,
      document.getElementById('name1'),
      document.getElementById('name2')
    ],
    statsNames: [null,
      document.getElementById('stats-name1'),
      document.getElementById('stats-name2')
    ],
    wins: [null,
      document.getElementById('wins1'),
      document.getElementById('wins2')
    ],
    pointsScored: [null,
      document.getElementById('points1'),
      document.getElementById('points2')
    ],
    addBtns: document.querySelectorAll('.add-score'),
    undoBtn: document.getElementById('undo'),
    resetBtn: document.getElementById('reset'),
    mode11Btn: document.getElementById('mode-11'),
    mode21Btn: document.getElementById('mode-21'),
    serves2Btn: document.getElementById('serves-2'),
    serves3Btn: document.getElementById('serves-3'),
    serves5Btn: document.getElementById('serves-5'),
    themeToggle: document.getElementById('theme-toggle'),
    statsToggle: document.getElementById('stats-toggle'),
    statsPanel: document.querySelector('.stats-panel'),
    closeStats: document.getElementById('close-stats'),
    winnerModal: document.getElementById('winner-modal'),
    winnerName: document.getElementById('winner-name'),
    finalScore1: document.getElementById('final-score1'),
    finalScore2: document.getElementById('final-score2'),
    newMatchBtn: document.getElementById('new-match'),
    historyList: document.getElementById('history-list'),
    clearHistoryBtn: document.getElementById('clear-history')
  };
  
  // App state
  const state = {
    matchPoint: parseInt(localStorage.getItem('pp_match')) || 21,
    history: [],
    stats: {
      1: { wins: 0, points: 0, name: 'Player 1' },
      2: { wins: 0, points: 0, name: 'Player 2' }
    },
    matches: [],
    currentServer: 1,
    servesPerPlayer: parseInt(localStorage.getItem('pp_serves')) || 2
  };
  
  // Load saved data
  function loadSavedData() {
    // Load theme
    const savedTheme = localStorage.getItem('pp_theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    }
  
    // Load match point setting
    state.matchPoint = parseInt(localStorage.getItem('pp_match')) || 21;
    updateModeButtons();
    
    // Load serves per player setting
    state.servesPerPlayer = parseInt(localStorage.getItem('pp_serves')) || 2;
    updateServesButtons();
    
    // Load player names
    const savedNames = JSON.parse(localStorage.getItem('pp_names'));
    if (savedNames) {
      refs.names[1].textContent = savedNames[1];
      refs.names[2].textContent = savedNames[2];
      refs.statsNames[1].textContent = savedNames[1];
      refs.statsNames[2].textContent = savedNames[2];
      state.stats[1].name = savedNames[1];
      state.stats[2].name = savedNames[2];
    }
    
    // Load match history
    const savedMatches = JSON.parse(localStorage.getItem('pp_matches'));
    if (savedMatches && Array.isArray(savedMatches)) {
      state.matches = savedMatches;
      renderMatchHistory();
    }
    
    // Load player stats
    const savedStats = JSON.parse(localStorage.getItem('pp_stats'));
    if (savedStats) {
      state.stats = savedStats;
      updateStatsDisplay();
    }
    
    // Set initial server indicator
    updateServeIndicator();
  }
  
  // Update game mode buttons
  function updateModeButtons() {
    const activePoint = state.matchPoint;
    refs.mode11Btn.classList.toggle('active', activePoint === 11);
    refs.mode21Btn.classList.toggle('active', activePoint === 21);
  }
  
  // Update serves buttons
  function updateServesButtons() {
    const activeServes = state.servesPerPlayer;
    refs.serves2Btn.classList.toggle('active', activeServes === 2);
    refs.serves3Btn.classList.toggle('active', activeServes === 3);
    refs.serves5Btn.classList.toggle('active', activeServes === 5);
  }
  
  // Save player names
  function saveNames() {
    const names = {
      1: refs.names[1].textContent,
      2: refs.names[2].textContent
    };
    localStorage.setItem('pp_names', JSON.stringify(names));
  }
  
  // Save stats
  function saveStats() {
    localStorage.setItem('pp_stats', JSON.stringify(state.stats));
  }
  
  // Save match history
  function saveMatches() {
    localStorage.setItem('pp_matches', JSON.stringify(state.matches));
  }
  
  // Update stats display
  function updateStatsDisplay() {
    refs.wins[1].textContent = state.stats[1].wins;
    refs.wins[2].textContent = state.stats[2].wins;
    refs.pointsScored[1].textContent = state.stats[1].points;
    refs.pointsScored[2].textContent = state.stats[2].points;
    refs.statsNames[1].textContent = state.stats[1].name;
    refs.statsNames[2].textContent = state.stats[2].name;
  }
  
  // Render match history
  function renderMatchHistory() {
    refs.historyList.innerHTML = '';
    
    // Take last 5 matches
    const recentMatches = state.matches.slice(-5).reverse();
    
    if (recentMatches.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.textContent = 'No matches yet';
      refs.historyList.appendChild(emptyItem);
      return;
    }
    
    recentMatches.forEach(match => {
      const item = document.createElement('li');
      const winner = match.winner === 1 ? state.stats[1].name : state.stats[2].name;
      
      item.innerHTML = `
        <div class="winner">${winner} won</div>
        <div>${state.stats[1].name} (${match.score1}) - (${match.score2}) ${state.stats[2].name}</div>
      `;
      
      refs.historyList.appendChild(item);
    });
  }
  
  // Update serve indicator
  function updateServeIndicator() {
    refs.serves[1].classList.toggle('active', state.currentServer === 1);
    refs.serves[2].classList.toggle('active', state.currentServer === 2);
  }
  
  // Calculate next server
  function calculateNextServer() {
    const totalScore = getScore(1) + getScore(2);
    
    // In endgame situations (deuce/advantage)
    if ((state.matchPoint === 21 && getScore(1) >= 20 && getScore(2) >= 20) || 
        (state.matchPoint === 11 && getScore(1) >= 10 && getScore(2) >= 10)) {
      // Switch server every point in endgame
      state.currentServer = (totalScore % 2 === 0) ? 1 : 2;
    } else {
      // Use the servesPerPlayer value for normal play
      state.currentServer = (Math.floor(totalScore / state.servesPerPlayer) % 2 === 0) ? 1 : 2;
    }
    
    updateServeIndicator();
  }
  
  // Get score for player
  function getScore(player) {
    return parseInt(refs.scores[player].textContent);
  }
  
  // Set score for player
  function setScore(player, value) {
    refs.scores[player].textContent = value;
  }
  
  // Add score for player
  function addScore(player) {
    // Get current scores
    let sc = getScore(player);
    
    // Save current state to history
    state.history.push({
      player1: getScore(1),
      player2: getScore(2),
      lastScorer: player
    });
    
    // Increment score
    sc++;
    setScore(player, sc);
    
    // Update statistics
    state.stats[player].points++;
    
    // Add the pulse animation
    refs.scores[player].classList.add('pulse');
    setTimeout(() => refs.scores[player].classList.remove('pulse'), 400);
    
    // Update serve indicator
    calculateNextServer();
    
    // Save state
    saveStats();
    
    // Check for win condition
    checkWinCondition();
  }
  
  // Check if someone won
  function checkWinCondition() {
    const score1 = getScore(1);
    const score2 = getScore(2);
    const minWinScore = state.matchPoint;
    
    // Win by 2 points
    if ((score1 >= minWinScore && score1 >= score2 + 2) || 
        (score2 >= minWinScore && score2 >= score1 + 2)) {
      // Determine winner
      const winner = score1 > score2 ? 1 : 2;
      
      // Update stats
      state.stats[winner].wins++;
      
      // Record match
      state.matches.push({
        date: new Date().toISOString(),
        winner: winner,
        score1: score1,
        score2: score2
      });
      
      // Save stats and matches
      saveStats();
      saveMatches();
      
      // Show winner
      showWinner(winner, score1, score2);
      
      // Fire confetti
      setTimeout(fireConfetti, 300);
    }
  }
  
  // Show winner modal
  function showWinner(winner, score1, score2) {
    // Set the content
    refs.winnerName.textContent = state.stats[winner].name;
    refs.finalScore1.textContent = score1;
    refs.finalScore2.textContent = score2;
    
    // Show the modal
    refs.winnerModal.classList.add('active');
  }
  
  // Undo last action
  function undo() {
    if (state.history.length === 0) {
      return;
    }
    
    const lastState = state.history.pop();
    
    // Restore scores
    setScore(1, lastState.player1);
    setScore(2, lastState.player2);
    
    // Decrement the point counter for the last scorer
    state.stats[lastState.lastScorer].points--;
    
    // Update serve indicator
    calculateNextServer();
    
    // Save stats
    saveStats();
  }
  
  // Reset the game
  function reset() {
    // Clear scores
    setScore(1, 0);
    setScore(2, 0);
    
    // Clear history for current game
    state.history = [];
    
    // Reset server
    state.currentServer = 1;
    updateServeIndicator();
  }
  
  // Enhanced confetti effect
  function fireConfetti() {
    const confettiCanvas = document.getElementById('confetti-canvas');
    const myConfetti = confetti.create(confettiCanvas, { resize: true });
    
    // First wave - explosion
    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Second wave - from sides
    setTimeout(() => {
      myConfetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      
      myConfetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);
  }
  
  // Initialize the app
  function init() {
    // Load data
    loadSavedData();
    
    // Set up event listeners
    refs.addBtns.forEach(btn =>
      btn.addEventListener('click', () => addScore(+btn.dataset.player))
    );
    
    refs.undoBtn.addEventListener('click', undo);
    refs.resetBtn.addEventListener('click', () => {
      if (confirm('Reset the current game?')) {
        reset();
      }
    });
    
    // Game mode buttons
    refs.mode11Btn.addEventListener('click', () => {
      state.matchPoint = 11;
      localStorage.setItem('pp_match', 11);
      updateModeButtons();
      if (getScore(1) > 0 || getScore(2) > 0) {
        if (confirm('Change game mode to 11 points? Current game will be reset.')) {
          reset();
        }
      }
    });
    
    refs.mode21Btn.addEventListener('click', () => {
      state.matchPoint = 21;
      localStorage.setItem('pp_match', 21);
      updateModeButtons();
      if (getScore(1) > 0 || getScore(2) > 0) {
        if (confirm('Change game mode to 21 points? Current game will be reset.')) {
          reset();
        }
      }
    });
    
    // Serves per player buttons
    refs.serves2Btn.addEventListener('click', () => {
      state.servesPerPlayer = 2;
      localStorage.setItem('pp_serves', 2);
      updateServesButtons();
      calculateNextServer(); // Update the current server based on new serves setting
    });
    
    refs.serves3Btn.addEventListener('click', () => {
      state.servesPerPlayer = 3;
      localStorage.setItem('pp_serves', 3);
      updateServesButtons();
      calculateNextServer(); // Update the current server based on new serves setting
    });
    
    refs.serves5Btn.addEventListener('click', () => {
      state.servesPerPlayer = 5;
      localStorage.setItem('pp_serves', 5);
      updateServesButtons();
      calculateNextServer(); // Update the current server based on new serves setting
    });
    
    // Theme toggle
    refs.themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      localStorage.setItem('pp_theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
    
    // Stats panel
    refs.statsToggle.addEventListener('click', () => {
      refs.statsPanel.classList.toggle('active');
      updateStatsDisplay();
      renderMatchHistory();
    });
    
    refs.closeStats.addEventListener('click', () => {
      refs.statsPanel.classList.remove('active');
    });
    
    // Editable player names
    refs.names.forEach((el, index) => {
      if (!el) return;
      
      el.addEventListener('click', () => {
        const newName = prompt('Player name:', el.textContent);
        if (newName && newName.trim()) {
          el.textContent = newName.trim();
          refs.statsNames[index].textContent = newName.trim();
          state.stats[index].name = newName.trim();
          saveNames();
          saveStats();
        }
      });
    });
    
    // Winner modal
    refs.newMatchBtn.addEventListener('click', () => {
      refs.winnerModal.classList.remove('active');
      reset();
    });
    
    // Clear history
    refs.clearHistoryBtn.addEventListener('click', () => {
      if (confirm('Clear all match history and stats?')) {
        state.matches = [];
        state.stats[1].wins = 0;
        state.stats[1].points = 0;
        state.stats[2].wins = 0;
        state.stats[2].points = 0;
        saveMatches();
        saveStats();
        renderMatchHistory();
        updateStatsDisplay();
      }
    });
  }
  
  // Start the app
  document.addEventListener('DOMContentLoaded', init);