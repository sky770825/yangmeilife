// 手機遊戲引擎 - 專為觸控設計的遊戲
class MobileGameEngine {
  constructor() {
    this.currentGame = null;
    this.gameStates = {};
    this.vibrateSupported = 'vibrate' in navigator;
    this.touchEvents = {};
    this.initTouchEvents();
  }

  initTouchEvents() {
    // 防止觸控時的默認行為
    document.addEventListener('touchstart', (e) => {
      if (e.target.closest('.game-area')) {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (e.target.closest('.game-area')) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  vibrate(pattern = [100]) {
    if (this.vibrateSupported) {
      navigator.vibrate(pattern);
    }
  }

  playSound(type) {
    // 優化的音效系統 - 使用 Web Audio API 池化
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // 如果音頻上下文被暫停，恢復它
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    let frequency = 440;
    switch(type) {
      case 'click': frequency = 800; break;
      case 'success': frequency = 600; break;
      case 'error': frequency = 300; break;
      case 'win': frequency = 1000; break;
    }
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime); // 降低音量
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.08);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.08);
  }

  showToast(message, type = 'info') {
    // 優化 Toast 顯示 - 避免重複創建
    const existingToast = document.querySelector('.game-toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `game-toast fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 will-change-transform`;
    
    switch(type) {
      case 'success': toast.className += ' bg-green-500'; break;
      case 'error': toast.className += ' bg-red-500'; break;
      case 'warning': toast.className += ' bg-yellow-500'; break;
      default: toast.className += ' bg-blue-500'; break;
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 使用 requestAnimationFrame 優化動畫
    requestAnimationFrame(() => {
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 200);
      }, 1500);
    });
  }
}

// 翻轉卡片記憶遊戲 - 手機優化版
class MobileMemoryGame {
  constructor() {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.score = 0;
    this.timeLeft = 90; // 增加時間
    this.timer = null;
    this.gameStarted = false;
    this.moves = 0;
  }

  init() {
    this.createCards();
    this.render();
    this.startTimer();
  }

  createCards() {
    const symbols = ['🏠', '💰', '🚗', '🏆', '🎯', '⭐', '🎮', '🎨'];
    this.cards = [];
    
    symbols.forEach((symbol, index) => {
      this.cards.push({ id: index * 2, symbol: symbol, flipped: false, matched: false });
      this.cards.push({ id: index * 2 + 1, symbol: symbol, flipped: false, matched: false });
    });
    
    this.cards = this.shuffleArray(this.cards);
  }

  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  render() {
    const grid = document.getElementById('memoryGrid');
    if (!grid) return;

    // 使用 DocumentFragment 提高性能
    const fragment = document.createDocumentFragment();
    grid.innerHTML = '';
    grid.className = 'grid grid-cols-4 gap-2 max-w-sm mx-auto';
    
    this.cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-3xl cursor-pointer transition-transform duration-200 touch-manipulation will-change-transform';
      
      if (card.flipped) {
        cardElement.innerHTML = card.symbol;
        cardElement.className += ' bg-gradient-to-br from-yellow-400 to-orange-500 scale-105 shadow-lg';
      } else if (card.matched) {
        cardElement.innerHTML = card.symbol;
        cardElement.className += ' bg-gradient-to-br from-green-400 to-green-600 opacity-75';
      } else {
        cardElement.innerHTML = '❓';
        cardElement.className += ' hover:scale-105 active:scale-95';
      }
      
      // 使用事件委託提高性能
      cardElement.dataset.index = index;
      cardElement.ontouchstart = (e) => {
        e.preventDefault();
        this.flipCard(index);
      };
      cardElement.onclick = () => this.flipCard(index);
      
      fragment.appendChild(cardElement);
    });

    grid.appendChild(fragment);
    this.updateUI();
  }

  flipCard(index) {
    if (!this.gameStarted) {
      this.gameStarted = true;
    }

    const card = this.cards[index];
    if (card.flipped || card.matched || this.flippedCards.length >= 2) return;

    card.flipped = true;
    this.flippedCards.push({ index, card });
    this.moves++;
    
    // 使用 requestAnimationFrame 優化渲染
    requestAnimationFrame(() => {
      this.render();
    });
    
    gameEngine.playSound('click');
    gameEngine.vibrate([50]);

    if (this.flippedCards.length === 2) {
      setTimeout(() => this.checkMatch(), 1000); // 減少等待時間
    }
  }

  checkMatch() {
    const [first, second] = this.flippedCards;
    
    if (first.card.symbol === second.card.symbol) {
      first.card.matched = true;
      second.card.matched = true;
      this.matchedPairs++;
      this.score += 20;
      gameEngine.playSound('success');
      gameEngine.vibrate([100, 50, 100]);
      gameEngine.showToast('配對成功！', 'success');
      
      if (this.matchedPairs === 8) {
        this.gameWin();
      }
    } else {
      first.card.flipped = false;
      second.card.flipped = false;
      gameEngine.playSound('error');
      gameEngine.vibrate([200]);
    }
    
    this.flippedCards = [];
    
    // 使用 requestAnimationFrame 優化渲染
    requestAnimationFrame(() => {
      this.render();
      this.updateUI();
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      
      // 使用 requestAnimationFrame 優化 UI 更新
      requestAnimationFrame(() => {
        this.updateUI();
      });
      
      if (this.timeLeft <= 0) {
        this.gameOver();
      }
    }, 1000);
  }

  updateUI() {
    document.getElementById('memoryScore').textContent = this.score;
    document.getElementById('memoryTime').textContent = this.timeLeft;
    document.getElementById('memoryMoves').textContent = this.moves;
  }

  gameWin() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.score += this.timeLeft * 5 + (20 - this.moves) * 10;
    this.updateUI();
    gameEngine.playSound('win');
    gameEngine.vibrate([100, 50, 100, 50, 200]);
    gameEngine.showToast(`恭喜完成！分數: ${this.score}`, 'success');
    setTimeout(() => {
      updateScore('memory', this.score);
      closeGame();
    }, 1500); // 減少等待時間
  }

  gameOver() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    gameEngine.playSound('error');
    gameEngine.vibrate([300, 100, 300]);
    gameEngine.showToast(`時間到！分數: ${this.score}`, 'error');
    setTimeout(() => {
      updateScore('memory', this.score);
      closeGame();
    }, 1500); // 減少等待時間
  }
}

// 滑動消除遊戲 - 全新手機遊戲
class SwipeEliminateGame {
  constructor() {
    this.grid = [];
    this.size = 6;
    this.score = 0;
    this.moves = 30;
    this.targetScore = 1000;
    this.gameStarted = false;
    this.selectedTile = null;
    this.touchStartPos = null;
  }

  init() {
    this.createGrid();
    this.render();
  }

  createGrid() {
    this.grid = [];
    const colors = ['🔴', '🟡', '🔵', '🟢', '🟣', '🟠'];
    
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = {
          color: colors[Math.floor(Math.random() * colors.length)],
          matched: false
        };
      }
    }
    
    this.removeMatches();
  }

  render() {
    const grid = document.getElementById('eliminateGrid');
    if (!grid) return;

    // 使用 DocumentFragment 提高性能
    const fragment = document.createDocumentFragment();
    grid.innerHTML = '';
    grid.className = 'grid grid-cols-6 gap-1 max-w-xs mx-auto';
    
    this.grid.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        const tileElement = document.createElement('div');
        tileElement.className = 'aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-transform duration-150 touch-manipulation will-change-transform';
        
        if (!tile.matched) {
          tileElement.innerHTML = tile.color;
          tileElement.className += ' hover:scale-105 active:scale-95';
          
          // 使用數據屬性存儲位置信息
          tileElement.dataset.row = rowIndex;
          tileElement.dataset.col = colIndex;
          
          // 觸控事件
          tileElement.ontouchstart = (e) => {
            e.preventDefault();
            this.handleTouchStart(e, rowIndex, colIndex);
          };
          tileElement.ontouchend = (e) => {
            e.preventDefault();
            this.handleTouchEnd(e, rowIndex, colIndex);
          };
          tileElement.onclick = () => this.selectTile(rowIndex, colIndex);
        } else {
          tileElement.className += ' bg-gray-100 opacity-50';
        }
        
        fragment.appendChild(tileElement);
      });
    });

    grid.appendChild(fragment);
    this.updateUI();
  }

  handleTouchStart(e, row, col) {
    e.preventDefault();
    this.touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    this.selectTile(row, col);
  }

  handleTouchEnd(e, row, col) {
    e.preventDefault();
    if (!this.touchStartPos) return;
    
    const touchEndPos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const deltaX = touchEndPos.x - this.touchStartPos.x;
    const deltaY = touchEndPos.y - this.touchStartPos.y;
    
    // 降低滑動閾值，提高響應性
    if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) {
      this.handleSwipe(row, col, deltaX, deltaY);
    }
    
    this.touchStartPos = null;
  }

  handleSwipe(row, col, deltaX, deltaY) {
    let newRow = row;
    let newCol = col;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑動
      newCol += deltaX > 0 ? 1 : -1;
    } else {
      // 垂直滑動
      newRow += deltaY > 0 ? 1 : -1;
    }
    
    if (newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size) {
      this.swapTiles(row, col, newRow, newCol);
    }
  }

  selectTile(row, col) {
    if (this.grid[row][col].matched) return;
    
    if (this.selectedTile) {
      if (this.selectedTile.row === row && this.selectedTile.col === col) {
        this.selectedTile = null;
      } else if (this.isAdjacent(this.selectedTile, { row, col })) {
        this.swapTiles(this.selectedTile.row, this.selectedTile.col, row, col);
        this.selectedTile = null;
      } else {
        this.selectedTile = { row, col };
      }
    } else {
      this.selectedTile = { row, col };
    }
    
    // 使用 requestAnimationFrame 優化渲染
    requestAnimationFrame(() => {
      this.render();
    });
  }

  isAdjacent(tile1, tile2) {
    const rowDiff = Math.abs(tile1.row - tile2.row);
    const colDiff = Math.abs(tile1.col - tile2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }

  swapTiles(row1, col1, row2, col2) {
    [this.grid[row1][col1], this.grid[row2][col2]] = [this.grid[row2][col2], this.grid[row1][col1]];
    
    if (this.gameStarted) {
      this.moves--;
    } else {
      this.gameStarted = true;
    }
    
    const matches = this.findMatches();
    if (matches.length > 0) {
      this.removeMatches();
      this.score += matches.length * 10;
      gameEngine.playSound('success');
      gameEngine.vibrate([100]);
      gameEngine.showToast(`消除 ${matches.length} 個！`, 'success');
    } else {
      // 如果沒有匹配，交換回來
      [this.grid[row1][col1], this.grid[row2][col2]] = [this.grid[row2][col2], this.grid[row1][col1]];
      gameEngine.playSound('error');
      gameEngine.vibrate([200]);
    }
    
    // 使用 requestAnimationFrame 優化渲染
    requestAnimationFrame(() => {
      this.render();
    });
    
    if (this.score >= this.targetScore) {
      this.gameWin();
    } else if (this.moves <= 0) {
      this.gameOver();
    }
  }

  findMatches() {
    const matches = [];
    
    // 檢查水平匹配
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 2; j++) {
        if (this.grid[i][j].color === this.grid[i][j+1].color && 
            this.grid[i][j].color === this.grid[i][j+2].color) {
          matches.push({ row: i, col: j, type: 'horizontal', length: 3 });
        }
      }
    }
    
    // 檢查垂直匹配
    for (let i = 0; i < this.size - 2; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j].color === this.grid[i+1][j].color && 
            this.grid[i][j].color === this.grid[i+2][j].color) {
          matches.push({ row: i, col: j, type: 'vertical', length: 3 });
        }
      }
    }
    
    return matches;
  }

  removeMatches() {
    const matches = this.findMatches();
    matches.forEach(match => {
      for (let i = 0; i < match.length; i++) {
        if (match.type === 'horizontal') {
          this.grid[match.row][match.col + i].matched = true;
        } else {
          this.grid[match.row + i][match.col].matched = true;
        }
      }
    });
    
    // 掉落新方塊
    this.dropNewTiles();
  }

  dropNewTiles() {
    const colors = ['🔴', '🟡', '🔵', '🟢', '🟣', '🟠'];
    
    for (let col = 0; col < this.size; col++) {
      // 移動已匹配的方塊到頂部
      const column = [];
      for (let row = 0; row < this.size; row++) {
        if (!this.grid[row][col].matched) {
          column.push(this.grid[row][col]);
        }
      }
      
      // 填充新方塊
      while (column.length < this.size) {
        column.unshift({
          color: colors[Math.floor(Math.random() * colors.length)],
          matched: false
        });
      }
      
      // 更新列
      for (let row = 0; row < this.size; row++) {
        this.grid[row][col] = column[row];
      }
    }
  }

  updateUI() {
    document.getElementById('eliminateScore').textContent = this.score;
    document.getElementById('eliminateMoves').textContent = this.moves;
    document.getElementById('eliminateTarget').textContent = this.targetScore;
  }

  gameWin() {
    gameEngine.playSound('win');
    gameEngine.vibrate([100, 50, 100, 50, 200]);
    gameEngine.showToast(`恭喜達成目標！分數: ${this.score}`, 'success');
    setTimeout(() => {
      updateScore('eliminate', this.score);
      closeGame();
    }, 1500); // 減少等待時間
  }

  gameOver() {
    gameEngine.playSound('error');
    gameEngine.vibrate([300, 100, 300]);
    gameEngine.showToast(`步數用完！分數: ${this.score}`, 'error');
    setTimeout(() => {
      updateScore('eliminate', this.score);
      closeGame();
    }, 1500); // 減少等待時間
  }
}

// 點擊反應遊戲 - 測試反應速度
class ReactionGame {
  constructor() {
    this.score = 0;
    this.round = 0;
    this.maxRounds = 10;
    this.reactionTimes = [];
    this.gameStarted = false;
    this.waitingForClick = false;
    this.startTime = 0;
    this.timeoutId = null;
  }

  init() {
    this.render();
    this.startRound();
  }

  render() {
    const gameArea = document.getElementById('reactionArea');
    if (!gameArea) return;

    gameArea.innerHTML = `
      <div class="text-center">
        <div class="text-6xl mb-4">🎯</div>
        <div id="reactionMessage" class="text-2xl font-bold mb-4">準備開始</div>
        <div id="reactionButton" class="w-32 h-32 mx-auto rounded-full bg-red-500 cursor-pointer transition-all duration-300 touch-manipulation"></div>
        <div class="mt-4 text-sm text-gray-600">
          回合: <span id="reactionRound">0</span>/10 | 
          平均反應: <span id="reactionAvg">0</span>ms
        </div>
      </div>
    `;

    const button = document.getElementById('reactionButton');
    button.ontouchstart = (e) => {
      e.preventDefault();
      this.handleClick();
    };
    button.onclick = () => this.handleClick();
  }

  startRound() {
    if (this.round >= this.maxRounds) {
      this.gameEnd();
      return;
    }

    this.round++;
    this.waitingForClick = false;
    this.updateUI();

    // 隨機等待時間 (1-4秒)
    const waitTime = 1000 + Math.random() * 3000;
    
    setTimeout(() => {
      if (!this.gameStarted) {
        this.gameStarted = true;
      }
      
      this.waitingForClick = true;
      document.getElementById('reactionMessage').textContent = '點擊！';
      document.getElementById('reactionButton').className = 'w-32 h-32 mx-auto rounded-full bg-green-500 cursor-pointer transition-all duration-300 touch-manipulation animate-pulse';
      this.startTime = Date.now();
      
      // 如果5秒內沒點擊，自動結束回合
      this.timeoutId = setTimeout(() => {
        this.endRound(false);
      }, 5000);
      
    }, waitTime);
  }

  handleClick() {
    if (!this.waitingForClick) {
      gameEngine.playSound('error');
      gameEngine.vibrate([200]);
      gameEngine.showToast('太快了！等綠色再點擊', 'error');
      return;
    }

    const reactionTime = Date.now() - this.startTime;
    this.endRound(true, reactionTime);
  }

  endRound(success, reactionTime = 0) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.waitingForClick = false;
    
    if (success && reactionTime > 0) {
      this.reactionTimes.push(reactionTime);
      this.score += Math.max(0, 1000 - reactionTime);
      
      gameEngine.playSound('success');
      gameEngine.vibrate([50]);
      gameEngine.showToast(`反應時間: ${reactionTime}ms`, 'success');
      
      document.getElementById('reactionButton').className = 'w-32 h-32 mx-auto rounded-full bg-blue-500 cursor-pointer transition-all duration-300 touch-manipulation';
    } else {
      gameEngine.playSound('error');
      gameEngine.vibrate([300]);
      gameEngine.showToast('失敗！', 'error');
      
      document.getElementById('reactionButton').className = 'w-32 h-32 mx-auto rounded-full bg-red-500 cursor-pointer transition-all duration-300 touch-manipulation';
    }

    this.updateUI();
    
    setTimeout(() => {
      this.startRound();
    }, 1000); // 減少等待時間
  }

  updateUI() {
    document.getElementById('reactionRound').textContent = this.round;
    
    if (this.reactionTimes.length > 0) {
      const avg = Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length);
      document.getElementById('reactionAvg').textContent = avg;
    }
  }

  gameEnd() {
    const avgReaction = this.reactionTimes.length > 0 ? 
      Math.round(this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length) : 0;
    
    gameEngine.playSound('win');
    gameEngine.vibrate([100, 50, 100, 50, 200]);
    gameEngine.showToast(`遊戲結束！平均反應: ${avgReaction}ms`, 'success');
    
    setTimeout(() => {
      updateScore('reaction', this.score);
      closeGame();
    }, 1500); // 減少等待時間
  }
}

// 簡單的數字合併遊戲 - 手機優化版
class SimpleMergeGame {
  constructor() {
    this.grid = [];
    this.size = 4;
    this.score = 0;
    this.gameOver = false;
    this.won = false;
  }

  init() {
    this.createGrid();
    this.addRandomTile();
    this.addRandomTile();
    this.render();
    this.setupSwipeControls();
  }

  createGrid() {
    this.grid = [];
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = 0;
      }
    }
  }

  addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  setupSwipeControls() {
    const gameArea = document.getElementById('mergeArea');
    if (!gameArea) return;

    let startX, startY, endX, endY;

    gameArea.ontouchstart = (e) => {
      e.preventDefault();
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    gameArea.ontouchend = (e) => {
      e.preventDefault();
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // 降低滑動閾值，提高響應性
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑動
        if (Math.abs(deltaX) > 30) {
          this.move(deltaX > 0 ? 'right' : 'left');
        }
      } else {
        // 垂直滑動
        if (Math.abs(deltaY) > 30) {
          this.move(deltaY > 0 ? 'down' : 'up');
        }
      }
    };
  }

  render() {
    const grid = document.getElementById('mergeGrid');
    if (!grid) return;

    // 使用 DocumentFragment 提高性能
    const fragment = document.createDocumentFragment();
    grid.innerHTML = '';
    grid.className = 'grid grid-cols-4 gap-2 max-w-xs mx-auto';
    
    this.grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellElement = document.createElement('div');
        cellElement.className = 'aspect-square bg-gray-300 rounded-lg flex items-center justify-center text-lg font-bold transition-transform duration-150 will-change-transform';
        
        if (cell !== 0) {
          cellElement.textContent = cell;
          cellElement.className += ` ${this.getCellClass(cell)}`;
        }
        
        fragment.appendChild(cellElement);
      });
    });

    grid.appendChild(fragment);
    document.getElementById('mergeScore').textContent = this.score;
  }

  getCellClass(value) {
    const classes = {
      2: 'bg-blue-100 text-blue-800',
      4: 'bg-blue-200 text-blue-800',
      8: 'bg-green-100 text-green-800',
      16: 'bg-green-200 text-green-800',
      32: 'bg-yellow-100 text-yellow-800',
      64: 'bg-yellow-200 text-yellow-800',
      128: 'bg-orange-100 text-orange-800',
      256: 'bg-orange-200 text-orange-800',
      512: 'bg-red-100 text-red-800',
      1024: 'bg-red-200 text-red-800',
      2048: 'bg-purple-200 text-purple-800'
    };
    return classes[value] || 'bg-gray-100 text-gray-800';
  }

  move(direction) {
    if (this.gameOver) return;

    let moved = false;
    
    switch (direction) {
      case 'left':
        moved = this.moveLeft();
        break;
      case 'right':
        moved = this.moveRight();
        break;
      case 'up':
        moved = this.moveUp();
        break;
      case 'down':
        moved = this.moveDown();
        break;
    }

    if (moved) {
      this.addRandomTile();
      
      // 使用 requestAnimationFrame 優化渲染
      requestAnimationFrame(() => {
        this.render();
      });
      
      gameEngine.playSound('click');
      gameEngine.vibrate([50]);

      if (this.checkWin()) {
        this.gameWin();
      } else if (this.checkGameOver()) {
        this.gameLose();
      }
    }
  }

  moveLeft() {
    let moved = false;
    for (let i = 0; i < this.size; i++) {
      const row = this.grid[i].filter(cell => cell !== 0);
      const newRow = [];
      
      for (let j = 0; j < row.length; j++) {
        if (j < row.length - 1 && row[j] === row[j + 1]) {
          newRow.push(row[j] * 2);
          this.score += row[j] * 2;
          j++;
        } else {
          newRow.push(row[j]);
        }
      }
      
      while (newRow.length < this.size) {
        newRow.push(0);
      }
      
      if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
        moved = true;
      }
      this.grid[i] = newRow;
    }
    return moved;
  }

  moveRight() {
    let moved = false;
    for (let i = 0; i < this.size; i++) {
      const row = this.grid[i].filter(cell => cell !== 0);
      const newRow = [];
      
      for (let j = row.length - 1; j >= 0; j--) {
        if (j > 0 && row[j] === row[j - 1]) {
          newRow.unshift(row[j] * 2);
          this.score += row[j] * 2;
          j--;
        } else {
          newRow.unshift(row[j]);
        }
      }
      
      while (newRow.length < this.size) {
        newRow.unshift(0);
      }
      
      if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
        moved = true;
      }
      this.grid[i] = newRow;
    }
    return moved;
  }

  moveUp() {
    this.transpose();
    const moved = this.moveLeft();
    this.transpose();
    return moved;
  }

  moveDown() {
    this.transpose();
    const moved = this.moveRight();
    this.transpose();
    return moved;
  }

  transpose() {
    const newGrid = [];
    for (let i = 0; i < this.size; i++) {
      newGrid[i] = [];
      for (let j = 0; j < this.size; j++) {
        newGrid[i][j] = this.grid[j][i];
      }
    }
    this.grid = newGrid;
  }

  checkWin() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 2048) {
          return true;
        }
      }
    }
    return false;
  }

  checkGameOver() {
    // 檢查是否有空格
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 0) {
          return false;
        }
      }
    }

    // 檢查是否可以合併
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const current = this.grid[i][j];
        if (
          (i > 0 && this.grid[i - 1][j] === current) ||
          (i < this.size - 1 && this.grid[i + 1][j] === current) ||
          (j > 0 && this.grid[i][j - 1] === current) ||
          (j < this.size - 1 && this.grid[i][j + 1] === current)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  gameWin() {
    if (!this.won) {
      this.won = true;
      gameEngine.playSound('win');
      gameEngine.vibrate([100, 50, 100, 50, 200]);
      gameEngine.showToast('恭喜達到2048！', 'success');
    }
  }

  gameLose() {
    this.gameOver = true;
    gameEngine.playSound('error');
    gameEngine.vibrate([300, 100, 300]);
    gameEngine.showToast(`遊戲結束！分數: ${this.score}`, 'error');
    setTimeout(() => {
      updateScore('merge', this.score);
      closeGame();
    }, 1500); // 減少等待時間
  }
}

// 全局遊戲引擎實例
const gameEngine = new MobileGameEngine();

// 遊戲啟動函數
function startMemoryGame() {
  currentGameInstance = new MobileMemoryGame();
  currentGameInstance.init();
}

function startEliminateGame() {
  currentGameInstance = new SwipeEliminateGame();
  currentGameInstance.init();
}

function startReactionGame() {
  currentGameInstance = new ReactionGame();
  currentGameInstance.init();
}

function startMergeGame() {
  currentGameInstance = new SimpleMergeGame();
  currentGameInstance.init();
}
