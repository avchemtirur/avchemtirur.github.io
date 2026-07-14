```javascript
window.CouponViews = window.CouponViews || {};

window.CouponViews.reward = {
  featureSettings: {},
  rewardProbabilities: {},
  currentReward: null,
  customerSession: null,
  wallet: null,
  lastScan: null,
  scratchCanvas: null,
  scratchContext: null,
  scratchPercentage: 0,
  isSpinning: false,
  confettiPieces: [],
  animationFrameId: null,

  init: function() {
    this.loadFeatureSettings();
    this.loadRewardProbabilities();
    this.loadCustomerSession();
    this.loadWallet();
    this.getLastScan();

    if (!this.customerSession || !this.lastScan) {
      this.redirectToRegister();
      return;
    }

    this.decideReward();
    this.render();
    this.showRewardScreen();
  },

  loadFeatureSettings: function() {
    try {
      if (typeof CouponDB !== 'undefined' && CouponDB.settings && CouponDB.settings.features) {
        this.featureSettings = CouponDB.settings.features;
      } else {
        this.featureSettings = this.getDefaultSettings();
      }
    } catch (error) {
      console.error('[Reward] Error loading feature settings:', error);
      this.featureSettings = this.getDefaultSettings();
    }
  },

  getDefaultSettings: function() {
    return {
      rewardSystem: true,
      instantGift: true,
      scratchCard: true,
      luckyDraw: true,
      points: true,
      wallet: true,
      rewardHistory: true,
      redeemSystem: true,
      betterLuck: true,
      animation: true,
      sound: true,
      vibration: true
    };
  },

  loadRewardProbabilities: function() {
    try {
      if (typeof CouponDB !== 'undefined' && CouponDB.rewardProbabilities) {
        this.rewardProbabilities = CouponDB.rewardProbabilities;
      } else {
        this.rewardProbabilities = this.getDefaultProbabilities();
      }
    } catch (error) {
      console.error('[Reward] Error loading probabilities:', error);
      this.rewardProbabilities = this.getDefaultProbabilities();
    }
  },

  getDefaultProbabilities: function() {
    return {
      INSTANT_GIFT: 5,
      LUCKY_DRAW: 10,
      SCRATCH_CARD: 20,
      POINTS: 60,
      BETTER_LUCK: 5
    };
  },

  loadCustomerSession: function() {
    try {
      if (typeof CouponDB !== 'undefined' && CouponDB.customerSession) {
        this.customerSession = CouponDB.customerSession;
      }
    } catch (error) {
      console.error('[Reward] Error loading customer session:', error);
    }
  },

  loadWallet: function() {
    try {
      const walletData = localStorage.getItem('coupon_wallet_' + (this.customerSession?.sessionId || 'default'));
      if (walletData) {
        this.wallet = JSON.parse(walletData);
      } else {
        this.wallet = this.createNewWallet();
      }
    } catch (error) {
      console.error('[Reward] Error loading wallet:', error);
      this.wallet = this.createNewWallet();
    }
  },

  createNewWallet: function() {
    return {
      customerId: this.customerSession?.sessionId || 'unknown',
      customerName: this.customerSession?.name || '',
      mobile: this.customerSession?.mobile || '',
      totalPoints: 0,
      todayPoints: 0,
      lifetimePoints: 0,
      rewards: [],
      giftHistory: [],
      couponHistory: [],
      redeemedRewards: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  },

  getLastScan: function() {
    try {
      if (typeof CouponDB !== 'undefined' && CouponDB.customerSession && CouponDB.customerSession.lastScan) {
        this.lastScan = CouponDB.customerSession.lastScan;
      }
    } catch (error) {
      console.error('[Reward] Error getting last scan:', error);
    }
  },

  decideReward: function() {
    if (!this.featureSettings.rewardSystem) {
      this.currentReward = {
        type: 'NO_REWARD',
        message: 'Reward system is currently disabled'
      };
      return;
    }

    const rewardType = this.getRewardType();

    switch (rewardType) {
      case 'INSTANT_GIFT':
        this.currentReward = this.generateInstantGift();
        break;
      case 'LUCKY_DRAW':
        this.currentReward = this.generateLuckyDraw();
        break;
      case 'SCRATCH_CARD':
        this.currentReward = this.generateScratchCard();
        break;
      case 'POINTS':
        this.currentReward = this.generatePoints();
        break;
      case 'BETTER_LUCK':
        this.currentReward = this.generateBetterLuck();
        break;
      default:
        this.currentReward = this.generateBetterLuck();
    }
  },

  getRewardType: function() {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;

    const rewardTypes = [
      { type: 'INSTANT_GIFT', enabled: this.featureSettings.instantGift },
      { type: 'LUCKY_DRAW', enabled: this.featureSettings.luckyDraw },
      { type: 'SCRATCH_CARD', enabled: this.featureSettings.scratchCard },
      { type: 'POINTS', enabled: this.featureSettings.points },
      { type: 'BETTER_LUCK', enabled: this.featureSettings.betterLuck }
    ];

    for (const reward of rewardTypes) {
      if (!reward.enabled) continue;

      const probability = this.rewardProbabilities[reward.type] || 0;
      cumulativeProbability += probability;

      if (random <= cumulativeProbability) {
        return reward.type;
      }
    }

    return 'BETTER_LUCK';
  },

  generateInstantGift: function() {
    const gifts = [
      { name: 'AV CHEM T-Shirt', value: '₹299' },
      { name: 'AV CHEM Cap', value: '₹149' },
      { name: 'AV CHEM Mug', value: '₹199' },
      { name: 'AV CHEM Sticker Pack', value: '₹99' },
      { name: 'AV CHEM Pen Set', value: '₹249' }
    ];

    const randomGift = gifts[Math.floor(Math.random() * gifts.length)];

    return {
      type: 'INSTANT_GIFT',
      gift: randomGift,
      rewardId: this.generateRewardId(),
      claimed: false,
      claimedAt: null,
      status: 'PENDING'
    };
  },

  generateLuckyDraw: function() {
    const prizes = [
      { name: 'Waterproofing Kit', value: '₹2999', icon: '🎁' },
      { name: 'Tile Adhesive Set', value: '₹1999', icon: '🎁' },
      { name: 'Epoxy Flooring Kit', value: '₹3499', icon: '🎁' },
      { name: '₹500 Store Voucher', value: '₹500', icon: '🎫' },
      { name: '₹250 Store Voucher', value: '₹250', icon: '🎫' }
    ];

    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];

    return {
      type: 'LUCKY_DRAW',
      prizes: prizes,
      selectedPrize: randomPrize,
      rewardId: this.generateRewardId(),
      claimed: false,
      claimedAt: null,
      status: 'PENDING',
      spun: false
    };
  },

  generateScratchCard: function() {
    const rewards = [
      { name: '₹50 Discount', value: 50 },
      { name: '₹100 Discount', value: 100 },
      { name: '₹25 Discount', value: 25 },
      { name: 'Free Sample', value: 0 },
      { name: 'Better Luck Next Time', value: 0 }
    ];

    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

    return {
      type: 'SCRATCH_CARD',
      reward: randomReward,
      rewardId: this.generateRewardId(),
      claimed: false,
      claimedAt: null,
      status: 'PENDING',
      scratched: false
    };
  },

  generatePoints: function() {
    const points = [50, 100, 150, 200, 250][Math.floor(Math.random() * 5)];

    return {
      type: 'POINTS',
      points: points,
      rewardId: this.generateRewardId(),
      claimed: false,
      claimedAt: null,
      status: 'PENDING'
    };
  },

  generateBetterLuck: function() {
    return {
      type: 'BETTER_LUCK',
      message: 'Better Luck Next Time!',
      rewardId: this.generateRewardId(),
      claimed: true,
      claimedAt: new Date().toISOString(),
      status: 'COMPLETED'
    };
  },

  generateRewardId: function() {
    return 'reward_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  checkDuplicate: function() {
    if (!this.lastScan || !this.wallet.couponHistory) {
      return false;
    }

    return this.wallet.couponHistory.some(c => c.code === this.lastScan.code);
  },

  render: function() {
    const container = document.getElementById('app');
    if (!container) {
      console.error('[Reward] App container not found');
      return;
    }

    container.innerHTML = `
      <div class="reward-wrapper">
        <div class="reward-container">
          <div id="rewardContent"></div>
          <div id="confettiContainer" class="confetti-container"></div>
        </div>
      </div>
    `;
  },

  showRewardScreen: function() {
    if (!this.currentReward) {
      this.showBetterLuck();
      return;
    }

    switch (this.currentReward.type) {
      case 'INSTANT_GIFT':
        this.showInstantGift();
        break;
      case 'LUCKY_DRAW':
        this.showLuckyDraw();
        break;
      case 'SCRATCH_CARD':
        this.showScratchCard();
        break;
      case 'POINTS':
        this.showPoints();
        break;
      case 'BETTER_LUCK':
        this.showBetterLuck();
        break;
      default:
        this.showBetterLuck();
    }
  },

  showInstantGift: function() {
    const content = document.getElementById('rewardContent');
    if (!content) return;

    content.innerHTML = `
      <div class="reward-card reward-card-gift">
        <div class="reward-header">
          <h2 class="reward-title">Congratulations!</h2>
          <p class="reward-subtitle">You won an instant gift</p>
        </div>

        <div class="gift-container">
          <div class="gift-icon">🎁</div>
          <h3 class="gift-name">${this.currentReward.gift.name}</h3>
          <p class="gift-value">${this.currentReward.gift.value}</p>
        </div>

        <div class="reward-info">
          <p class="reward-id">Reward ID: ${this.currentReward.rewardId}</p>
          <p class="reward-time">Claimed at: ${new Date().toLocaleString()}</p>
        </div>

        <button id="claimGiftBtn" class="btn btn-primary btn-block">Claim Gift</button>
        <button id="continueScanBtn" class="btn btn-secondary btn-block">Continue Scanning</button>
      </div>
    `;

    if (this.featureSettings.animation) {
      this.playAnimation('scaleIn');
      this.playConfetti();
    }

    if (this.featureSettings.sound) {
      this.playSound('success');
    }

    if (this.featureSettings.vibration) {
      this.vibrate([100, 200, 100]);
    }

    const claimBtn = document.getElementById('claimGiftBtn');
    if (claimBtn) {
      claimBtn.addEventListener('click', () => this.claimGift());
    }

    const continueBtn = document.getElementById('continueScanBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => this.continueScan());
    }
  },

  showLuckyDraw: function() {
    const content = document.getElementById('rewardContent');
    if (!content) return;

    content.innerHTML = `
      <div class="reward-card reward-card-draw">
        <div class="reward-header">
          <h2 class="reward-title">Lucky Draw!</h2>
          <p class="reward-subtitle">Spin to reveal your prize</p>
        </div>

        <div class="wheel-container">
          <canvas id="wheelCanvas" class="spin-wheel" width="300" height="300"></canvas>
          <button id="spinBtn" class="btn-spin" ${this.currentReward.spun ? 'disabled' : ''}>
            SPIN
          </button>
        </div>

        <div id="prizeDisplay" class="prize-display" style="display: none;">
          <p class="prize-label">You Won:</p>
          <p id="prizeName" class="prize-name"></p>
          <p id="prizeValue" class="prize-value"></p>
        </div>

        <button id="claimDrawBtn" class="btn btn-primary btn-block" style="display: none;">Claim Prize</button>
        <button id="continueScanBtn" class="btn btn-secondary btn-block">Continue Scanning</button>
      </div>
    `;

    if (this.featureSettings.animation) {
      this.playAnimation('fadeIn');
    }

    this.drawSpinWheel();

    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) {
      spinBtn.addEventListener('click', () => this.spinWheel());
    }

    const claimBtn = document.getElementById('claimDrawBtn');
    if (claimBtn) {
      claimBtn.addEventListener('click', () => this.claimDraw());
    }

    const continueBtn = document.getElementById('continueScanBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => this.continueScan());
    }
  },

  drawSpinWheel: function() {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;

    const prizes = this.currentReward.prizes;
    const sliceAngle = (2 * Math.PI) / prizes.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    prizes.forEach((prize, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = index % 2 === 0 ? '#6A3FA0' : '#8A6510';
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(prize.name.substring(0, 10), radius - 20, 5);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 20);
    ctx.lineTo(centerX - 10, centerY - 5);
    ctx.lineTo(centerX + 10, centerY - 5);
    ctx.closePath();
    ctx.fillStyle = '#6A3FA0';
    ctx.fill();
  },

  spinWheel: function() {
    if (this.isSpinning || this.currentReward.spun) return;

    this.isSpinning = true;
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) spinBtn.disabled = true;

    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;

    let rotation = 0;
    let spinSpeed = 30;
    const targetRotation = Math.random() * 360 + 1440;

    const animate = () => {
      rotation += spinSpeed;
      spinSpeed *= 0.98;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);

      const prizes = this.currentReward.prizes;
      const sliceAngle = (2 * Math.PI) / prizes.length;

      prizes.forEach((prize, index) => {
        const startAngle = index * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = index % 2 === 0 ? '#6A3FA0' : '#8A6510';
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      ctx.restore();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 20);
      ctx.lineTo(centerX - 10, centerY - 5);
      ctx.lineTo(centerX + 10, centerY - 5);
      ctx.closePath();
      ctx.fillStyle = '#6A3FA0';
      ctx.fill();

      if (spinSpeed > 0.1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.currentReward.spun = true;
        this.showWheelPrize();

        if (this.featureSettings.sound) {
          this.playSound('success');
        }

        if (this.featureSettings.vibration) {
          this.vibrate([100, 200, 100]);
        }
      }
    };

    animate();
  },

  showWheelPrize: function() {
    const prizeDisplay = document.getElementById('prizeDisplay');
    const prizeName = document.getElementById('prizeName');
    const prizeValue = document.getElementById('prizeValue');
    const claimBtn = document.getElementById('claimDrawBtn');

    if (prizeDisplay && prizeName && prizeValue) {
      prizeName.textContent = this.currentReward.selectedPrize.name;
      prizeValue.textContent = this.currentReward.selectedPrize.value;
      prizeDisplay.style.display = 'block';
    }

    if (claimBtn) {
      claimBtn.style.display = 'block';
    }
  },

  showScratchCard: function() {
    const content = document.getElementById('rewardContent');
    if (!content) return;

    content.innerHTML = `
      <div class="reward-card reward-card-scratch">
        <div class="reward-header">
          <h2 class="reward-title">Scratch Card</h2>
          <p class="reward-subtitle">Scratch to reveal your reward</p>
        </div>

        <div class="scratch-container">
          <canvas id="scratchCanvas" class="scratch-canvas" width="300" height="200"></canvas>
          <div class="scratch-content">
            <p class="scratch-label">Your Reward:</p>
            <p id="scratchReward" class="scratch-reward">${this.currentReward.reward.name}</p>
            <p id="scratchValue" class="scratch-value">${this.currentReward.reward.value > 0 ? '₹' + this.currentReward.reward.value : ''}</p>
          </div>
        </div>

        <div id="scratchInfo" class="scratch-info" style="display: none;">
          <p id="scratchPercentageText">Scratched: 0%</p>
        </div>

        <button id="claimScratchBtn" class="btn btn-primary btn-block" style="display: none;">Claim Reward</button>
        <button id="continueScanBtn" class="btn btn-secondary btn-block">Continue Scanning</button>
      </div>
    `;

    if (this.featureSettings.animation) {
      this.playAnimation('fadeIn');
    }

    this.initScratchCanvas();

    const continueBtn = document.getElementById('continueScanBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => this.continueScan());
    }

    const claimBtn = document.getElementById('claimScratchBtn');
    if (claimBtn) {
      claimBtn.addEventListener('click', () => this.claimScratch());
    }
  },

  initScratchCanvas: function() {
    const canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;

    this.scratchCanvas = canvas;
    this.scratchContext = canvas.getContext('2d');

    const ctx = this.scratchContext;
    ctx.fillStyle = '#D8D3C7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#999';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);

    let isDrawing = false;

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    const scratch = (x, y) => {
      const imageData = ctx.getImageData(Math.max(0, x - 20), Math.max(0, y - 20), 40, 40);
      const data = imageData.data;
      let transparentPixels = 0;

      for (let i = 3; i < data.length; i += 4) {
        if (data[i] === 0) {
          transparentPixels++;
        }
      }

      ctx.clearRect(Math.max(0, x - 20), Math.max(0, y - 20), 40, 40);
      this.updateScratchPercentage();
    };

    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      const pos = getMousePos(e);
      scratch(pos.x, pos.y);
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const pos = getMousePos(e);
      scratch(pos.x, pos.y);
    });

    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
    });

    canvas.addEventListener('touchstart', (e) => {
      isDrawing = true;
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchmove', (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const touch = e.touches[0];
      const pos = getMousePos(touch);
      scratch(pos.x, pos.y);
    });

    canvas.addEventListener('touchend', () => {
      isDrawing = false;
    });
  },

  updateScratchPercentage: function() {
    if (!this.scratchCanvas || !this.scratchContext) return;

    const imageData = this.scratchContext.getImageData(0, 0, this.scratchCanvas.width, this.scratchCanvas.height);
    const data = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) {
        transparentPixels++;
      }
    }

    this.scratchPercentage = Math.round((transparentPixels / (data.length / 4)) * 100);

    const percentageText = document.getElementById('scratchPercentageText');
    if (percentageText) {
      percentageText.textContent = `Scratched: ${this.scratchPercentage}%`;
    }

    if (this.scratchPercentage >= 50) {
      this.showScratchReward();
    }
  },

  showScratchReward: function() {
    const scratchInfo = document.getElementById('scratchInfo');
    const claimBtn = document.getElementById('claimScratchBtn');

    if (scratchInfo) {
      scratchInfo.style.display = 'block';
    }

    if (claimBtn) {
      claimBtn.style.display = 'block';
    }

    if (this.featureSettings.confetti) {
      this.playConfetti();
    }

    if (this.featureSettings.sound) {
      this.playSound('success');
    }

    if (this.featureSettings.vibration) {
      this.vibrate([100, 50, 100]);
    }
  },

  showPoints: function() {
    const content = document.getElementById('rewardContent');
    if (!content) return;

    content.innerHTML = `
      <div class="reward-card reward-card-points">
        <div class="reward-header">
          <h2 class="reward-title">Points Earned!</h2>
          <p class="reward-subtitle">Added to your wallet</p>
        </div>

        <div class="points-container">
          <div class="points-display">
            <p class="points-number">+${this.currentReward.points}</p>
            <p class="points-label">Points</p>
          </div>

          <div class="wallet-summary">
            <div class="wallet-item">
              <span class="wallet-label">Today's Points:</span>
              <span class="wallet-value">${this.wallet.todayPoints + this.currentReward.points}</span>
            </div>
            <div class="wallet-item">
              <span class="wallet-label">Total Points:</span>
              <span class="wallet-value">${this.wallet.totalPoints + this.currentReward.points}</span>
            </div>
          </div>
        </div>

        <div class="reward-info">
          <p class="reward-id">Reward ID: ${this.currentReward.rewardId}</p>
          <p class="reward-time">Awarded at: ${new Date().toLocaleString()}</p>
        </div>

        <button id="continuePointsBtn" class="btn btn-primary btn-block">Continue Scanning</button>
      </div>
    `;

    this.addPointsToWallet(this.currentReward.points);

    if (this.featureSettings.animation) {
      this.playAnimation('scaleIn');
      this.playConfetti();
    }

    if (this.featureSettings.sound) {
      this.playSound('success');
    }

    if (this.featureSettings.vibration) {
      this.vibrate([100, 200, 100]);
    }

    const continueBtn = document.getElementById('continuePointsBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => this.continueScan());
    }
  },

  showBetterLuck: function() {
    const content = document.getElementById('rewardContent');
    if (!content) return;

    content.innerHTML = `
      <div class="reward-card reward-card-better-luck">
        <div class="reward-header">
          <h2 class="reward-title">Better Luck Next Time!</h2>
          <p class="reward-subtitle">Keep scanning to win rewards</p>
        </div>

        <div class="better-luck-container">
          <div class="better-luck-icon">🍀</div>
          <p class="better-luck-message">Don't worry, you'll win on your next scan!</p>
        </div>

        <div class="reward-info">
          <p class="reward-id">Reward ID: ${this.currentReward.rewardId}</p>
          <p class="reward-time">Attempted at: ${new Date().toLocaleString()}</p>
        </div>

        <button id="continueLuckBtn" class="btn btn-primary btn-block">Continue Scanning</button>
      </div>
    `;

    if (this.featureSettings.animation) {
      this.playAnimation('fadeIn');
    }

    if (this.featureSettings.sound) {
      this.playSound('neutral');
    }

    const continueBtn = document.getElementById('continueLuckBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => this.continueScan());
    }
  },

  addPointsToWallet: function(points) {
    if (!this.featureSettings.points) return;

    this.wallet.totalPoints += points;
    this.wallet.todayPoints += points;
    this.wallet.lastUpdated = new Date().toISOString();

    this.currentReward.claimed = true;
    this.currentReward.claimedAt = new Date().toISOString();
    this.currentReward.status = 'COMPLETED';

    this.saveRewardHistory();
    this.saveWallet();
  },

  claimGift: function() {
    this.currentReward.claimed = true;
    this.currentReward.claimedAt = new Date().toISOString();
    this.currentReward.status = 'CLAIMED';

    if (this.featureSettings.rewardHistory) {
      this.saveRewardHistory();
    }

    this.wallet.giftHistory.push({
      rewardId: this.currentReward.rewardId,
      gift: this.currentReward.gift,
      claimedAt: this.currentReward.claimedAt
    });

    this.saveWallet();
    this.showSuccessScreen('Gift Claimed Successfully');
  },

  claimDraw: function() {
    this.currentReward.claimed = true;
    this.currentReward.claimedAt = new Date().toISOString();
    this.currentReward.status = 'CLAIMED';

    if (this.featureSettings.rewardHistory) {
      this.saveRewardHistory();
    }

    this.wallet.giftHistory.push({
      rewardId: this.currentReward.rewardId,
      prize: this.currentReward.selectedPrize,
      claimedAt: this.currentReward.claimedAt
    });

    this.saveWallet();
    this.showSuccessScreen('Prize Claimed Successfully');
  },

  claimScratch: function() {
    this.currentReward.claimed = true;
    this.currentReward.claimedAt = new Date().toISOString();
    this.currentReward.scratched = true;
    this.currentReward.status = 'CLAIMED';

    if (this.currentReward.reward.value > 0) {
      this.wallet.totalPoints += this.currentReward.reward.value;
      this.wallet.todayPoints += this.currentReward.reward.value;
    }

    if (this.featureSettings.rewardHistory) {
      this.saveRewardHistory();
    }

    this.saveWallet();
    this.showSuccessScreen('Scratch Card Claimed Successfully');
  },

  saveRewardHistory: function() {
    if (!this.featureSettings.rewardHistory) return;

    try {
      let history = [];
      const historyData = localStorage.getItem('coupon_reward_history_' + (this.customerSession?.sessionId || 'default'));
      if (historyData) {
        history = JSON.parse(historyData);
      }

      history.push({
        rewardId: this.currentReward.rewardId,
        customerId: this.customerSession?.sessionId,
        couponCode: this.lastScan?.code,
        rewardType: this.currentReward.type,
        details: JSON.stringify(this.currentReward),
        status: this.currentReward.status,
        timestamp: new Date().toISOString()
      });

      localStorage.setItem('coupon_reward_history_' + (this.customerSession?.sessionId || 'default'), JSON.stringify(history));
    } catch (error) {
      console.error('[Reward] Error saving reward history:', error);
    }
  },

  saveWallet: function() {
    try {
      this.wallet.lastUpdated = new Date().toISOString();
      localStorage.setItem('coupon_wallet_' + (this.customerSession?.sessionId || 'default'), JSON.stringify(this.wallet));
    } catch (error) {
      console.error('[Reward] Error saving wallet:', error);
    }
  },

  showSuccessScreen: function(message) {
    const content = document.getElementById('rewardContent');
    if (!content) return;

    content.innerHTML = `
      <div class="reward-card reward-card-success">
        <div class="success-icon">✓</div>
        <h2 class="success-title">${message}</h2>
        <p class="success-message">Thank you for using H4 Coupons</p>
        <button id="finalContinueBtn" class="btn btn-primary btn-block">Continue Scanning</button>
      </div>
    `;

    if (this.featureSettings.animation) {
      this.playAnimation('slideUp');
      this.playConfetti();
    }

    const continueBtn = document.getElementById('finalContinueBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => this.continueScan());
    }
  },

  continueScan: function() {
    this.destroy();
    if (typeof CouponRouter !== 'undefined' && typeof CouponRouter.navigate === 'function') {
      CouponRouter.navigate('#/customer-scan');
    }
  },

  redirectToRegister: function() {
    if (typeof CouponRouter !== 'undefined' && typeof CouponRouter.navigate === 'function') {
      CouponRouter.navigate('#/register');
    }
  },

  playAnimation: function(type) {
    const container = document.querySelector('.reward-card');
    if (!container) return;

    const animations = {
      scaleIn: 'animate-scale-in',
      fadeIn: 'animate-fade-in',
      slideUp: 'animate-slide-up'
    };

    const animationClass = animations[type] || 'animate-fade-in';
    container.classList.add(animationClass);
  },

  playConfetti: function() {
    if (!this.featureSettings.animation) return;

    const container = document.getElementById('confettiContainer');
    if (!container) return;

    const confettiCount = 50;
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = ['#6A3FA0', '#8A6510', '#E8A63D', '#5B6660'][Math.floor(Math.random() * 4)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      container.appendChild(confetti);

      setTimeout(() => confetti.remove(), 2500);
    }
  },

  playSound: function(type) {
    if (!this.featureSettings.sound) return;

    const sounds = {
      success: 'M0,100 L50,50 L100,100',
      neutral: 'M0,100 L50,75 L100,100'
    };

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === 'success') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      } else {
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      }

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn('[Reward] Audio not available:', error);
    }
  },

  vibrate: function(pattern) {
    if (!this.featureSettings.vibration) return;

    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  },

  destroy: function() {
    try {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      this.currentReward = null;
      this.lastScan = null;
      this.scratchCanvas = null;
      this.scratchContext = null;
    } catch (error) {
      console.error('[Reward] Destroy error:', error);
    }
  }
};
```

```css
.reward-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f6f3ea 0%, #e8e3d4 100%);
  padding: 20px;
  font-family: 'IBM Plex Sans', sans-serif;
}

.reward-container {
  width: 100%;
  max-width: 500px;
  position: relative;
}

.reward-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 4px 16px rgba(33, 35, 31, 0.1);
}

.reward-header {
  text-align: center;
  margin-bottom: 32px;
}

.reward-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #21231f;
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: -0.01em;
}

.reward-subtitle {
  font-size: 14px;
  color: #5b6660;
  margin: 0;
}

.gift-container {
  text-align: center;
  margin: 32px 0;
  padding: 24px;
  background: #f6f3ea;
  border-radius: 12px;
}

.gift-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.gift-name {
  font-size: 20px;
  font-weight: 600;
  color: #21231f;
  margin: 0 0 8px;
}

.gift-value {
  font-size: 24px;
  font-weight: 700;
  color: #8a6510;
  margin: 0;
}

.points-container {
  text-align: center;
  margin: 32px 0;
}

.points-display {
  background: linear-gradient(135deg, #6a3fa0 0%, #8a6510 100%);
  color: #fff;
  padding: 40px 24px;
  border-radius: 16px;
  margin-bottom: 24px;
}

.points-number {
  font-size: 48px;
  font-weight: 800;
  margin: 0;
  font-family: 'Barlow Condensed', sans-serif;
}

.points-label {
  font-size: 16px;
  margin: 8px 0 0;
}

.wallet-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.wallet-item {
  padding: 16px;
  background: #f6f3ea;
  border-radius: 8px;
  text-align: center;
}

.wallet-label {
  display: block;
  font-size: 12px;
  color: #5b6660;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.wallet-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #6a3fa0;
}

.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 32px 0;
  position: relative;
}

.spin-wheel {
  width: 300px;
  height: 300px;
  max-width: 100%;
  margin: 0 auto;
}

.btn-spin {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #6a3fa0;
  color: #fff;
  border: none;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(106, 63, 160, 0.3);
  z-index: 10;
  transition: all 0.2s ease;
}

.btn-spin:hover:not(:disabled) {
  background: #8a6510;
  transform: translateX(-50%) scale(1.05);
}

.btn-spin:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prize-display {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, #6a3fa0 0%, #8a6510 100%);
  color: #fff;
  border-radius: 12px;
  margin-top: 16px;
}

.prize-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 8px;
  opacity: 0.9;
}

.prize-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
}

.prize-value {
  font-size: 20px;
  margin: 0;
}

.scratch-container {
  position: relative;
  margin: 32px 0;
  background: #f6f3ea;
  border-radius: 12px;
  padding: 20px;
}

.scratch-canvas {
  width: 100%;
  height: auto;
  border-radius: 8px;
  cursor: pointer;
  touch-action: none;
  user-select: none;
}

.scratch-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.scratch-label {
  font-size: 12px;
  color: #5b6660;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 8px;
}

.scratch-reward {
  font-size: 20px;
  font-weight: 700;
  color: #21231f;
  margin: 0;
}

.scratch-value {
  font-size: 18px;
  color: #8a6510;
  margin: 4px 0 0;
  font-weight: 700;
}

.scratch-info {
  text-align: center;
  padding: 16px;
  background: #e8f5e9;
  border-radius: 8px;
  margin-top: 16px;
}

.scratch-percentage-text {
  font-size: 14px;
  color: #2e7d32;
  font-weight: 600;
  margin: 0;
}

.better-luck-container {
  text-align: center;
  padding: 40px 24px;
  background: #f6f3ea;
  border-radius: 12px;
  margin: 32px 0;
}

.better-luck-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.better-luck-message {
  font-size: 16px;
  color: #5b6660;
  margin: 0;
  line-height: 1.5;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: #fff;
  font-size: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-weight: 700;
}

.success-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #21231f;
  margin: 0 0 12px;
  text-transform: uppercase;
}

.success-message {
  font-size: 14px;
  color: #5b6660;
  margin: 0 0 32px;
}

.reward-info {
  text-align: center;
  padding: 16px 0;
  border-top: 1px solid #d8d3c7;
  margin-top: 24px;
}

.reward-id {
  font-size: 12px;
  color: #5b6660;
  font-family: 'IBM Plex Mono', monospace;
  margin: 0 0 4px;
}

.reward-time {
  font-size: 12px;
  color: #5b6660;
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}

.btn-primary {
  background: #6a3fa0;
  color: #fff;
}

.btn-primary:hover {
  background: #8a6510;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #d8d3c7;
  color: #21231f;
}

.btn-secondary:hover {
  background: #c9c0b0;
}

.btn-block {
  width: 100%;
  margin-top: 16px;
}

.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  top: -10px;
  width: 10px;
  height: 10px;
  background: #6a3fa0;
  animation: fall 2.5s linear forwards;
}

@keyframes fall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes animate-scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes animate-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes animate-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reward-card {
  animation: animate-fade-in 0.3s ease;
}

@media (max-width: 600px) {
  .reward-card {
    padding: 24px 16px;
  }

  .reward-title {
    font-size: 24px;
  }

  .points-number {
    font-size: 36px;
  }

  .wallet-summary {
    grid-template-columns: 1fr;
  }

  .spin-wheel {
    width: 250px;
    height: 250px;
  }

  .gift-name {
    font-size: 18px;
  }
}

@media (prefers-color-scheme: dark) {
  .reward-wrapper {
    background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
  }

  .reward-card {
    background: #2a2a2a;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  }

  .reward-title {
    color: #fff;
  }

  .reward-subtitle,
  .wallet-label,
  .scratch-label {
    color: #b0b0b0;
  }

  .gift-container,
  .scratch-container,
  .better-luck-container,
  .wallet-item,
  .scratch-info {
    background: #333;
  }

  .gift-name,
  .scratch-reward,
  .success-title {
    color: #fff;
  }

  .btn-secondary {
    background: #444;
    color: #fff;
  }

  .btn-secondary:hover {
    background: #555;
  }

  .reward-info {
    border-top-color: #444;
  }
}
```