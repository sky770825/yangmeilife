// 遊戲引擎 - 所有小遊戲的實現
class GameEngine {
  constructor() {
    this.currentGame = null;
    this.gameStates = {};
    this.sounds = {};
    this.initSounds();
  }

  initSounds() {
    // 創建音效（使用Web Audio API）
    this.sounds = {
      click: this.createSound(800, 0.1),
      success: this.createSound([523, 659, 784], 0.3),
      error: this.createSound(200, 0.2),
      win: this.createSound([523, 659, 784, 1047], 0.5)
    };
  }

  createSound(frequency, duration) {
    return () => {
      if (typeof AudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (Array.isArray(frequency)) {
          frequency.forEach((freq, index) => {
            setTimeout(() => {
              oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            }, index * duration * 200);
          });
        } else {
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        }
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      }
    };
  }

  playSound(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName]();
    }
  }
}

// 記憶配對遊戲
class MemoryGame {
  constructor() {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.score = 0;
    this.timeLeft = 60;
    this.timer = null;
    this.gameStarted = false;
  }

  init() {
    this.createCards();
    this.render();
    this.startTimer();
  }

  createCards() {
    const symbols = ['🏠', '💰', '🚗', '🏆', '🎯', '⭐', '🎮', '🎨'];
    this.cards = [];
    
    // 創建配對的卡片
    symbols.forEach((symbol, index) => {
      this.cards.push({ id: index * 2, symbol: symbol, flipped: false, matched: false });
      this.cards.push({ id: index * 2 + 1, symbol: symbol, flipped: false, matched: false });
    });
    
    // 洗牌
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

    grid.innerHTML = '';
    this.cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'w-16 h-16 bg-indigo-500 rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 hover:scale-105';
      cardElement.innerHTML = card.flipped ? card.symbol : '?';
      cardElement.onclick = () => this.flipCard(index);
      grid.appendChild(cardElement);
    });
  }

  flipCard(index) {
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.startTimer();
    }

    const card = this.cards[index];
    if (card.flipped || card.matched || this.flippedCards.length >= 2) return;

    card.flipped = true;
    this.flippedCards.push({ index, card });
    this.render();
    this.playSound('click');

    if (this.flippedCards.length === 2) {
      setTimeout(() => this.checkMatch(), 1000);
    }
  }

  checkMatch() {
    const [first, second] = this.flippedCards;
    
    if (first.card.symbol === second.card.symbol) {
      first.card.matched = true;
      second.card.matched = true;
      this.matchedPairs++;
      this.score += 10;
      this.playSound('success');
      
      if (this.matchedPairs === 8) {
        this.gameWin();
      }
    } else {
      first.card.flipped = false;
      second.card.flipped = false;
      this.playSound('error');
    }
    
    this.flippedCards = [];
    this.render();
    this.updateScore();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      document.getElementById('memoryTime').textContent = this.timeLeft;
      
      if (this.timeLeft <= 0) {
        this.gameOver();
      }
    }, 1000);
  }

  updateScore() {
    document.getElementById('memoryScore').textContent = this.score;
  }

  gameWin() {
    clearInterval(this.timer);
    this.score += this.timeLeft * 5; // 時間獎勵
    this.updateScore();
    this.playSound('win');
    alert(`恭喜！你贏了！\n分數: ${this.score}`);
    updateScore('memory', this.score);
  }

  gameOver() {
    clearInterval(this.timer);
    this.playSound('error');
    alert(`時間到！\n分數: ${this.score}`);
    updateScore('memory', this.score);
  }

  reset() {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.score = 0;
    this.timeLeft = 60;
    this.gameStarted = false;
    clearInterval(this.timer);
    this.init();
  }
}

// 數字拼圖遊戲
class PuzzleGame {
  constructor() {
    this.size = 4;
    this.tiles = [];
    this.emptyIndex = 15;
    this.moves = 0;
    this.startTime = null;
    this.gameStarted = false;
  }

  init() {
    this.createTiles();
    this.shuffle();
    this.render();
  }

  createTiles() {
    this.tiles = [];
    for (let i = 1; i <= 15; i++) {
      this.tiles.push(i);
    }
    this.tiles.push(0); // 空位
  }

  shuffle() {
    // 使用可解的打亂算法
    for (let i = 0; i < 1000; i++) {
      const possibleMoves = this.getPossibleMoves();
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      this.moveTile(randomMove);
    }
  }

  getPossibleMoves() {
    const moves = [];
    const row = Math.floor(this.emptyIndex / this.size);
    const col = this.emptyIndex % this.size;

    if (row > 0) moves.push(this.emptyIndex - this.size); // 上
    if (row < this.size - 1) moves.push(this.emptyIndex + this.size); // 下
    if (col > 0) moves.push(this.emptyIndex - 1); // 左
    if (col < this.size - 1) moves.push(this.emptyIndex + 1); // 右

    return moves;
  }

  render() {
    const grid = document.getElementById('puzzleGrid');
    if (!grid) return;

    grid.innerHTML = '';
    this.tiles.forEach((tile, index) => {
      const tileElement = document.createElement('div');
      tileElement.className = 'w-16 h-16 bg-blue-500 text-white rounded-lg flex items-center justify-center text-lg font-bold cursor-pointer transition-all duration-300 hover:scale-105';
      
      if (tile === 0) {
        tileElement.className += ' bg-gray-300';
        tileElement.innerHTML = '';
      } else {
        tileElement.innerHTML = tile;
        tileElement.onclick = () => this.moveTile(index);
      }
      
      grid.appendChild(tileElement);
    });

    this.updateMoves();
    this.updateTime();
  }

  moveTile(index) {
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.startTime = Date.now();
      this.startTimer();
    }

    const possibleMoves = this.getPossibleMoves();
    if (!possibleMoves.includes(index)) return;

    // 交換位置
    [this.tiles[this.emptyIndex], this.tiles[index]] = [this.tiles[index], this.tiles[this.emptyIndex]];
    this.emptyIndex = index;
    this.moves++;
    
    this.render();
    this.playSound('click');

    if (this.isSolved()) {
      this.gameWin();
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateMoves() {
    document.getElementById('puzzleMoves').textContent = this.moves;
  }

  updateTime() {
    if (this.startTime) {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      document.getElementById('puzzleTime').textContent = elapsed;
    }
  }

  isSolved() {
    for (let i = 0; i < 15; i++) {
      if (this.tiles[i] !== i + 1) return false;
    }
    return this.tiles[15] === 0;
  }

  gameWin() {
    clearInterval(this.timer);
    const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const score = Math.max(0, 1000 - this.moves * 10 - timeElapsed * 5);
    
    this.playSound('win');
    alert(`恭喜完成拼圖！\n移動次數: ${this.moves}\n時間: ${timeElapsed}秒\n分數: ${score}`);
    updateScore('puzzle', score);
  }

  reset() {
    this.tiles = [];
    this.emptyIndex = 15;
    this.moves = 0;
    this.startTime = null;
    this.gameStarted = false;
    clearInterval(this.timer);
    this.init();
  }
}

// 房產大富翁遊戲
class MonopolyGame {
  constructor() {
    this.money = 1000;
    this.position = 0;
    this.round = 1;
    this.properties = [];
    this.dice = 0;
    this.gameStarted = false;
  }

  init() {
    this.createProperties();
    this.render();
  }

  createProperties() {
    const propertyData = [
      { name: '台北101', price: 200, rent: 50, color: 'red' },
      { name: '信義區', price: 150, rent: 40, color: 'blue' },
      { name: '天母', price: 120, rent: 30, color: 'green' },
      { name: '淡水', price: 100, rent: 25, color: 'yellow' },
      { name: '板橋', price: 80, rent: 20, color: 'purple' },
      { name: '新竹', price: 60, rent: 15, color: 'orange' },
      { name: '台中', price: 180, rent: 45, color: 'pink' },
      { name: '高雄', price: 160, rent: 40, color: 'cyan' }
    ];

    this.properties = propertyData.map((prop, index) => ({
      ...prop,
      id: index,
      owner: null,
      houses: 0
    }));
  }

  render() {
    const board = document.getElementById('monopolyBoard');
    if (!board) return;

    board.innerHTML = '';
    this.properties.forEach((property, index) => {
      const propertyElement = document.createElement('div');
      propertyElement.className = `p-2 rounded-lg text-center text-xs ${this.position === index ? 'ring-4 ring-yellow-400' : ''}`;
      
      let bgColor = 'bg-gray-200';
      if (property.owner === 'player') bgColor = 'bg-blue-500 text-white';
      if (property.owner === 'bank') bgColor = 'bg-red-500 text-white';
      
      propertyElement.className += ` ${bgColor}`;
      
      propertyElement.innerHTML = `
        <div class="font-bold">${property.name}</div>
        <div>$${property.price}</div>
        <div>租金: $${property.rent}</div>
        ${property.owner ? `<div class="text-xs">${property.owner === 'player' ? '你的' : '銀行'}</div>` : ''}
      `;
      
      propertyElement.onclick = () => this.buyProperty(index);
      board.appendChild(propertyElement);
    });

    this.updateUI();
  }

  rollDice() {
    if (!this.gameStarted) {
      this.gameStarted = true;
    }

    this.dice = Math.floor(Math.random() * 6) + 1;
    this.position = (this.position + this.dice) % this.properties.length;
    
    this.render();
    this.playSound('click');
    
    // 檢查是否需要支付租金
    const property = this.properties[this.position];
    if (property.owner === 'bank') {
      this.payRent(property);
    }
    
    this.updateUI();
  }

  buyProperty(index) {
    const property = this.properties[index];
    if (property.owner || this.money < property.price || this.position !== index) return;

    property.owner = 'player';
    this.money -= property.price;
    this.render();
    this.updateUI();
    this.playSound('success');
  }

  payRent(property) {
    const rent = property.rent;
    this.money -= rent;
    this.playSound('error');
    
    if (this.money <= 0) {
      this.gameOver();
    }
  }

  updateUI() {
    document.getElementById('monopolyMoney').textContent = this.money;
    document.getElementById('monopolyRound').textContent = this.round;
  }

  gameOver() {
    this.playSound('error');
    alert(`遊戲結束！\n最終資金: $${this.money}\n擁有房產: ${this.properties.filter(p => p.owner === 'player').length}個`);
    updateScore('monopoly', this.money);
  }

  reset() {
    this.money = 1000;
    this.position = 0;
    this.round = 1;
    this.properties = [];
    this.dice = 0;
    this.gameStarted = false;
    this.init();
  }
}

// 幸運轉盤遊戲
class WheelGame {
  constructor() {
    this.score = 0;
    this.spins = 3;
    this.isSpinning = false;
    this.segments = [
      { text: '10分', value: 10, color: '#FF6B6B' },
      { text: '20分', value: 20, color: '#4ECDC4' },
      { text: '30分', value: 30, color: '#45B7D1' },
      { text: '50分', value: 50, color: '#96CEB4' },
      { text: '100分', value: 100, color: '#FFEAA7' },
      { text: '再轉一次', value: 0, color: '#DDA0DD' },
      { text: '5分', value: 5, color: '#98D8C8' },
      { text: '15分', value: 15, color: '#F7DC6F' }
    ];
  }

  init() {
    this.drawWheel();
    this.render();
  }

  drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = centerX - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.segments.forEach((segment, index) => {
      const startAngle = (index * 2 * Math.PI) / this.segments.length;
      const endAngle = ((index + 1) * 2 * Math.PI) / this.segments.length;

      // 繪製扇形
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();
      ctx.stroke();

      // 繪製文字
      const textAngle = startAngle + (endAngle - startAngle) / 2;
      const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
      const textY = centerY + Math.sin(textAngle) * (radius * 0.7);

      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(segment.text, textX, textY);
    });
  }

  spin() {
    if (this.isSpinning || this.spins <= 0) return;

    this.isSpinning = true;
    this.spins--;
    this.render();

    const spins = 5 + Math.random() * 5; // 5-10圈
    const finalAngle = (spins * 2 * Math.PI) + (Math.random() * 2 * Math.PI);
    
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;

    canvas.style.transition = 'transform 3s ease-out';
    canvas.style.transform = `rotate(${finalAngle}rad)`;

    setTimeout(() => {
      const segmentIndex = Math.floor(((2 * Math.PI - (finalAngle % (2 * Math.PI))) / (2 * Math.PI)) * this.segments.length) % this.segments.length;
      const segment = this.segments[segmentIndex];
      
      this.handleResult(segment);
      this.isSpinning = false;
      canvas.style.transition = 'none';
      canvas.style.transform = 'rotate(0deg)';
    }, 3000);
  }

  handleResult(segment) {
    if (segment.value === 0) {
      this.spins++; // 再轉一次
      this.playSound('success');
      alert('再轉一次！');
    } else {
      this.score += segment.value;
      this.playSound('click');
      alert(`獲得 ${segment.value} 分！`);
    }

    this.render();

    if (this.spins <= 0) {
      setTimeout(() => {
        alert(`遊戲結束！\n總分: ${this.score}`);
        updateScore('wheel', this.score);
      }, 500);
    }
  }

  render() {
    document.getElementById('wheelScore').textContent = this.score;
    document.getElementById('wheelSpins').textContent = this.spins;
  }

  reset() {
    this.score = 0;
    this.spins = 3;
    this.isSpinning = false;
    this.init();
  }
}

// 2048遊戲
class Game2048 {
  constructor() {
    this.size = 4;
    this.grid = [];
    this.score = 0;
    this.gameOver = false;
  }

  init() {
    this.createGrid();
    this.addRandomTile();
    this.addRandomTile();
    this.render();
    this.setupKeyboard();
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

  render() {
    const grid = document.getElementById('game2048Grid');
    if (!grid) return;

    grid.innerHTML = '';
    this.grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellElement = document.createElement('div');
        cellElement.className = 'w-16 h-16 bg-gray-300 rounded flex items-center justify-center text-lg font-bold';
        
        if (cell !== 0) {
          cellElement.textContent = cell;
          cellElement.className += ` bg-${this.getCellColor(cell)} text-white`;
        }
        
        grid.appendChild(cellElement);
      });
    });

    document.getElementById('game2048Score').textContent = this.score;
  }

  getCellColor(value) {
    const colors = {
      2: 'blue-200',
      4: 'blue-300',
      8: 'blue-400',
      16: 'blue-500',
      32: 'green-400',
      64: 'green-500',
      128: 'yellow-400',
      256: 'yellow-500',
      512: 'orange-400',
      1024: 'orange-500',
      2048: 'red-500'
    };
    return colors[value] || 'gray-500';
  }

  move(direction) {
    if (this.gameOver) return;

    let moved = false;
    const oldGrid = this.grid.map(row => [...row]);

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
      this.render();
      this.playSound('click');

      if (this.checkWin()) {
        this.gameWin();
      } else if (this.checkGameOver()) {
        this.gameOver = true;
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
          j++; // 跳過下一個
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
          j--; // 跳過上一個
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

  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          this.move('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          this.move('right');
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          this.move('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          this.move('down');
          break;
      }
    });
  }

  gameWin() {
    this.playSound('win');
    alert(`恭喜達到2048！\n分數: ${this.score}`);
    updateScore('game2048', this.score);
  }

  gameLose() {
    this.playSound('error');
    alert(`遊戲結束！\n分數: ${this.score}`);
    updateScore('game2048', this.score);
  }

  reset() {
    this.grid = [];
    this.score = 0;
    this.gameOver = false;
    this.init();
  }
}

// 打字遊戲
class TypingGame {
  constructor() {
    this.texts = [
      "濬瑒房產生活平台提供最優質的服務",
      "房貸試算幫助您規劃購屋預算",
      "天氣資訊讓您掌握每日天氣變化",
      "垃圾車提醒確保您不會錯過清運時間",
      "發票對獎讓您輕鬆對獎不遺漏",
      "公車即時資訊讓您出行更便利",
      "趣味互動遊戲豐富您的休閒時光",
      "購屋補助資訊幫助您節省開支",
      "裝潢估價服務提供專業建議",
      "即時利率讓您掌握市場動態"
    ];
    this.currentText = '';
    this.userInput = '';
    this.startTime = null;
    this.wpm = 0;
    this.accuracy = 0;
    this.correctChars = 0;
    this.totalChars = 0;
  }

  init() {
    this.currentText = this.texts[Math.floor(Math.random() * this.texts.length)];
    this.render();
  }

  render() {
    const textElement = document.getElementById('typingText');
    const inputElement = document.getElementById('typingInput');
    
    if (!textElement || !inputElement) return;

    textElement.innerHTML = '';
    this.currentText.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      
      if (index < this.userInput.length) {
        if (char === this.userInput[index]) {
          span.className = 'text-green-500 bg-green-100';
        } else {
          span.className = 'text-red-500 bg-red-100';
        }
      }
      
      textElement.appendChild(span);
    });

    inputElement.value = this.userInput;
    inputElement.oninput = (e) => this.handleInput(e.target.value);
    inputElement.onkeydown = (e) => this.handleKeyDown(e);
    
    this.updateStats();
  }

  handleInput(value) {
    this.userInput = value;
    this.totalChars = this.userInput.length;
    this.correctChars = 0;
    
    for (let i = 0; i < Math.min(this.userInput.length, this.currentText.length); i++) {
      if (this.userInput[i] === this.currentText[i]) {
        this.correctChars++;
      }
    }
    
    this.render();
    
    if (this.userInput === this.currentText) {
      this.gameWin();
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Enter' && this.userInput === this.currentText) {
      this.gameWin();
    }
  }

  startTimer() {
    this.startTime = Date.now();
    this.timer = setInterval(() => {
      this.updateStats();
    }, 100);
  }

  updateStats() {
    if (this.startTime && this.userInput.length > 0) {
      const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // 分鐘
      this.wpm = Math.round((this.correctChars / 5) / timeElapsed);
      this.accuracy = Math.round((this.correctChars / this.totalChars) * 100);
      
      document.getElementById('typingWPM').textContent = this.wpm || 0;
      document.getElementById('typingAccuracy').textContent = this.accuracy || 0;
    }
  }

  gameWin() {
    clearInterval(this.timer);
    const score = Math.round(this.wpm * this.accuracy / 10);
    
    this.playSound('win');
    alert(`恭喜完成！\nWPM: ${this.wpm}\n準確率: ${this.accuracy}%\n分數: ${score}`);
    updateScore('typing', score);
  }

  reset() {
    this.userInput = '';
    this.startTime = null;
    this.wpm = 0;
    this.accuracy = 0;
    this.correctChars = 0;
    this.totalChars = 0;
    clearInterval(this.timer);
    this.init();
  }
}

// 全局遊戲實例
const gameEngine = new GameEngine();
let currentGameInstance = null;

// 遊戲啟動函數
function startMemoryGame() {
  currentGameInstance = new MemoryGame();
  currentGameInstance.init();
}

function startPuzzleGame() {
  currentGameInstance = new PuzzleGame();
  currentGameInstance.init();
}

function startMonopolyGame() {
  currentGameInstance = new MonopolyGame();
  currentGameInstance.init();
}

function spinWheel() {
  if (!currentGameInstance) {
    currentGameInstance = new WheelGame();
    currentGameInstance.init();
  }
  currentGameInstance.spin();
}

function start2048Game() {
  currentGameInstance = new Game2048();
  currentGameInstance.init();
}

function startTypingGame() {
  currentGameInstance = new TypingGame();
  currentGameInstance.init();
  currentGameInstance.startTimer();
}

// 音效播放
function playSound(soundName) {
  gameEngine.playSound(soundName);
}
