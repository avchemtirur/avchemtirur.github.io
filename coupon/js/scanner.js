window.CouponViews.scanner = { window.CouponViews || {};

window.CouponViews.scan = {
  scanner: null,
  videoElement: null,
  isScanning: false,
  isValidating: false,
  lastScannedCode: null,
  scannedCodes: new Set(),
  successSoundUrl: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YCIAAAAAAAAAAAAAAAAAAAAA',

  init: function() {
    this.checkRegistration();
    this.render();
    this.setupScanner();
  },

  checkRegistration: function() {
    if (typeof CouponDB === 'undefined' || !CouponDB.customerSession || !CouponDB.customerSession.isRegistered) {
      console.warn('[Scan] No registered customer found, redirecting to registration');
      if (typeof CouponRouter !== 'undefined' && typeof CouponRouter.navigate === 'function') {
        CouponRouter.navigate('#/register');
      }
      return false;
    }
    return true;
  },

  render: function(container) { 
    container.innerHTML = `
    if (!container) {
      console.error('[Scan] App container not found');
      return;
    }

    container.innerHTML = `
      <div class="scan-wrapper">
        <div class="scan-header">
          <h1 class="scan-title">Scan Coupon</h1>
          <p class="scan-subtitle">Position QR or Barcode within frame</p>
        </div>

        <div class="scan-video-container">
          <video
            id="scanVideo"
            class="scan-video"
            autoplay
            muted
            playsinline
            aria-label="Camera feed for scanning"
          ></video>

          <div class="scan-overlay">
            <div class="scan-frame"></div>
            <p class="scan-hint">Align barcode with the frame</p>
          </div>

          <div id="scanLoading" class="scan-loading" style="display: none;">
            <div class="spinner"></div>
            <p>Validating coupon...</p>
          </div>
        </div>

        <div class="scan-controls">
          <button id="switchCameraBtn" class="scan-btn scan-btn-secondary" title="Switch Camera">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </button>

          <button id="torchBtn" class="scan-btn scan-btn-secondary" title="Toggle Torch">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="1"></circle>
              <path d="M12 8v-5"></path>
              <path d="M4.22 4.22l-3.54 3.54"></path>
              <path d="M1 12h-5"></path>
              <path d="M4.22 19.78l-3.54-3.54"></path>
              <path d="M12 16v5"></path>
              <path d="M19.78 19.78l3.54-3.54"></path>
              <path d="M23 12h5"></path>
              <path d="M19.78 4.22l3.54 3.54"></path>
            </svg>
          </button>

          <button id="stopScanBtn" class="scan-btn scan-btn-primary" title="Cancel Scan">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div id="scanError" class="scan-error" role="alert" style="display: none;"></div>
      </div>

      <div id="scanDialog" class="scan-dialog" style="display: none;">
        <div class="scan-dialog-overlay" id="dialogOverlay"></div>
        <div class="scan-dialog-content">
          <div id="dialogIcon" class="scan-dialog-icon"></div>
          <h2 id="dialogTitle" class="scan-dialog-title"></h2>
          <p id="dialogMessage" class="scan-dialog-message"></p>
          <button id="dialogBtn" class="btn btn-primary btn-block">OK</button>
        </div>
      </div>
    `;
  },

  setupScanner: function() {
    const videoElement = document.getElementById('scanVideo');
    if (!videoElement) {
      console.error('[Scan] Video element not found');
      return;
    }

    this.videoElement = videoElement;
    this.initializeCouponScanner();
    this.attachControls();
  },

  async initializeCouponScanner() {
    try {
      if (typeof CouponScanner === 'undefined') {
        console.error('[Scan] CouponScanner not available');
        this.showError('Camera system not available. Please try again.');
        return;
      }

      this.scanner = new CouponScanner({
        facingMode: 'environment'
      });

      const initResult = await this.scanner.init(this.videoElement);

      if (!initResult.granted) {
        this.showError('Camera permission denied. Please enable camera access.');
        return;
      }

      this.scanner.onScan((code) => this.handleScan(code));
      this.scanner.onError((error) => this.handleScanError(error));

      this.scanner.startScanning();
      this.isScanning = true;
    } catch (error) {
      console.error('[Scan] Scanner initialization failed:', error);
      this.showError('Failed to initialize camera. Please try again.');
    }
  },

  attachControls: function() {
    const switchBtn = document.getElementById('switchCameraBtn');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => this.switchCamera());
    }

    const torchBtn = document.getElementById('torchBtn');
    if (torchBtn) {
      torchBtn.addEventListener('click', () => this.toggleTorch());
    }

    const stopBtn = document.getElementById('stopScanBtn');
    if (stopBtn) {
      stopBtn.addEventListener('click', () => this.cancelScan());
    }

    const dialogOverlay = document.getElementById('dialogOverlay');
    if (dialogOverlay) {
      dialogOverlay.addEventListener('click', () => this.closeDialog());
    }

    const dialogBtn = document.getElementById('dialogBtn');
    if (dialogBtn) {
      dialogBtn.addEventListener('click', () => this.closeDialog());
    }
  },

  async handleScan(code) {
    if (this.isValidating || this.lastScannedCode === code) {
      return;
    }

    this.lastScannedCode = code;
    this.isValidating = true;

    this.scanner.stopScanning();
    this.showLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const validationResult = this.validateCoupon(code);

      if (!validationResult.valid) {
        this.showLoading(false);
        this.showDialog(
          validationResult.title,
          validationResult.message,
          'error',
          () => {
            this.lastScannedCode = null;
            this.isValidating = false;
            this.scanner.startScanning();
          }
        );
        return;
      }

      this.playSuccessSound();
      this.vibrate();

      await this.saveScanData(code, validationResult.coupon);

      this.showLoading(false);
      this.showDialog(
        'Coupon Valid',
        'Proceeding to rewards...',
        'success',
        () => {
          if (typeof CouponRouter !== 'undefined' && typeof CouponRouter.navigate === 'function') {
            CouponRouter.navigate('#/reward');
          }
        }
      );
    } catch (error) {
      console.error('[Scan] Error during validation:', error);
      this.showLoading(false);
      this.showDialog(
        'Error',
        'Failed to validate coupon. Please try again.',
        'error',
        () => {
          this.lastScannedCode = null;
          this.isValidating = false;
          this.scanner.startScanning();
        }
      );
    }
  },

  validateCoupon: function(code) {
    try {
      if (!code || code.trim() === '') {
        return {
          valid: false,
          title: 'Invalid Code',
          message: 'Scanned code is empty or invalid.'
        };
      }

      if (this.scannedCodes.has(code)) {
        return {
          valid: false,
          title: 'Duplicate Scan',
          message: 'This coupon has already been scanned.'
        };
      }

      if (typeof CouponDB === 'undefined' || !CouponDB.coupons) {
        return {
          valid: false,
          title: 'System Error',
          message: 'Coupon database not available.'
        };
      }

      const coupon = CouponDB.coupons.find(c => c.code === code || c.serial === code);

      if (!coupon) {
        return {
          valid: false,
          title: 'Coupon Not Found',
          message: 'This coupon does not exist in our system.'
        };
      }

      if (coupon.status !== 'ACTIVE') {
        return {
          valid: false,
          title: 'Invalid Coupon',
          message: 'This coupon is not active.'
        };
      }

      const currentDate = new Date();
      if (coupon.expiryDate && new Date(coupon.expiryDate) < currentDate) {
        return {
          valid: false,
          title: 'Coupon Expired',
          message: 'This coupon has expired. Please try another.'
        };
      }

      if (coupon.isRedeemed) {
        return {
          valid: false,
          title: 'Coupon Already Used',
          message: 'This coupon has already been redeemed.'
        };
      }

      this.scannedCodes.add(code);

      return {
        valid: true,
        coupon: coupon,
        title: 'Coupon Valid',
        message: 'Coupon validated successfully.'
      };
    } catch (error) {
      console.error('[Scan] Validation error:', error);
      return {
        valid: false,
        title: 'Validation Error',
        message: 'An error occurred while validating the coupon.'
      };
    }
  },

  async saveScanData(code, coupon) {
    try {
      if (typeof CouponDB === 'undefined' || !CouponDB.customerSession) {
        throw new Error('Customer session not found');
      }

      const scanData = {
        code: code,
        couponType: coupon.type || 'standard',
        serial: coupon.serial || code,
        couponCode: coupon.code || code,
        scanTime: new Date().toISOString(),
        deviceTime: Date.now(),
        customerId: CouponDB.customerSession.sessionId
      };

      if (!CouponDB.customerSession.scans) {
        CouponDB.customerSession.scans = [];
      }

      CouponDB.customerSession.scans.push(scanData);
      CouponDB.customerSession.lastScan = scanData;

      return true;
    } catch (error) {
      console.error('[Scan] Error saving scan data:', error);
      throw error;
    }
  },

  handleScanError: function(error) {
    console.error('[Scan] Scanner error:', error);
    if (!this.isValidating) {
      this.showError('Camera error. Please try again.');
    }
  },

  async switchCamera() {
    try {
      this.scanner.stopScanning();
      await this.scanner.switchCamera();
      this.scanner.startScanning();
    } catch (error) {
      console.error('[Scan] Camera switch failed:', error);
      this.showDialog(
        'Camera Switch Failed',
        'Unable to switch camera. Please try again.',
        'error',
        () => this.scanner.startScanning()
      );
    }
  },

  async toggleTorch() {
    try {
      await this.scanner.toggleTorch();
      const torchBtn = document.getElementById('torchBtn');
      if (torchBtn) {
        torchBtn.classList.toggle('active', this.scanner.torchEnabled);
      }
    } catch (error) {
      console.error('[Scan] Torch toggle failed:', error);
      this.showDialog(
        'Torch Not Available',
        'Your device does not support torch functionality.',
        'error'
      );
    }
  },

  cancelScan: function() {
    if (this.scanner) {
      this.scanner.destroy();
    }
    if (typeof CouponRouter !== 'undefined' && typeof CouponRouter.navigate === 'function') {
      CouponRouter.navigate('#/register');
    }
  },

  showLoading: function(show) {
    const loadingEl = document.getElementById('scanLoading');
    if (loadingEl) {
      loadingEl.style.display = show ? 'flex' : 'none';
    }
  },

  showError: function(message) {
    const errorEl = document.getElementById('scanError');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      setTimeout(() => {
        errorEl.style.display = 'none';
      }, 4000);
    }
  },

  showDialog: function(title, message, type = 'info', onClose = null) {
    const dialog = document.getElementById('scanDialog');
    const titleEl = document.getElementById('dialogTitle');
    const messageEl = document.getElementById('dialogMessage');
    const iconEl = document.getElementById('dialogIcon');

    if (!dialog || !titleEl || !messageEl || !iconEl) {
      return;
    }

    titleEl.textContent = title;
    messageEl.textContent = message;

    if (type === 'success') {
      iconEl.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      iconEl.className = 'scan-dialog-icon icon-success';
    } else if (type === 'error') {
      iconEl.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
      iconEl.className = 'scan-dialog-icon icon-error';
    } else {
      iconEl.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
      iconEl.className = 'scan-dialog-icon icon-info';
    }

    this.dialogCallback = onClose;
    dialog.style.display = 'flex';
  },

  closeDialog: function() {
    const dialog = document.getElementById('scanDialog');
    if (dialog) {
      dialog.style.display = 'none';
    }
    if (this.dialogCallback && typeof this.dialogCallback === 'function') {
      this.dialogCallback();
    }
    this.dialogCallback = null;
  },

  playSuccessSound: function() {
    try {
      const audio = new Audio(this.successSoundUrl);
      audio.volume = 0.3;
      audio.play().catch(e => console.warn('[Scan] Could not play sound:', e));
    } catch (error) {
      console.warn('[Scan] Audio not available:', error);
    }
  },

  vibrate: function() {
    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }
  },

  destroy: function() {
    try {
      if (this.scanner) {
        this.scanner.destroy();
      }
      this.isScanning = false;
      this.isValidating = false;
    } catch (error) {
      console.error('[Scan] Destroy error:', error);
    }
  }
};