```javascript
window.CouponScanner = class {
  constructor(options = {}) {
    this.video = null;
    this.stream = null;
    this.facingMode = options.facingMode || 'environment';
    this.torchEnabled = false;
    this.isActive = false;
    this.capabilities = {};
    this.scanning = false;
    this.scanCanvas = null;
    this.scanContext = null;
    this.lastScannedCode = null;
    this.lastScannedTime = 0;
    this.scanCooldown = 1500;
    this.scanCallbacks = [];
    this.errorCallbacks = [];
    this.animationFrameId = null;
    this.barcodeDetector = null;
    this.detectorReady = false;
    this.jsqrLoaded = false;
  }

  async init(videoElement) {
    if (!videoElement) {
      throw new Error('Video element required');
    }

    this.video = videoElement;
    this.setupScanCanvas();
    await this.initializeBarcodeDetector();

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.capabilities = this.detectCapabilities(devices);

      return await this.requestCameraPermission();
    } catch (error) {
      console.error('[Scanner] Init failed:', error);
      throw error;
    }
  }

  setupScanCanvas() {
    this.scanCanvas = document.createElement('canvas');
    this.scanContext = this.scanCanvas.getContext('2d', { willReadFrequently: true });
  }

  async initializeBarcodeDetector() {
    try {
      if ('BarcodeDetector' in window) {
        this.barcodeDetector = new BarcodeDetector({
          formats: ['qr_code', 'code_128']
        });
        this.detectorReady = true;
        console.log('[Scanner] BarcodeDetector initialized');
      } else {
        console.warn('[Scanner] BarcodeDetector not available, attempting jsQR fallback');
        await this.loadJsQRFallback();
      }
    } catch (error) {
      console.warn('[Scanner] BarcodeDetector initialization failed:', error);
      await this.loadJsQRFallback();
    }
  }

  async loadJsQRFallback() {
    return new Promise((resolve) => {
      if (typeof jsQR !== 'undefined') {
        this.jsqrLoaded = true;
        console.log('[Scanner] jsQR already loaded');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';

      script.onload = () => {
        if (typeof jsQR !== 'undefined') {
          this.jsqrLoaded = true;
          console.log('[Scanner] jsQR fallback loaded successfully');
          resolve();
        } else {
          console.error('[Scanner] jsQR loaded but not available globally');
          resolve();
        }
      };

      script.onerror = () => {
        console.error('[Scanner] Failed to load jsQR fallback');
        resolve();
      };

      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    });
  }

  detectCapabilities(devices) {
    const videoDevices = devices.filter(d => d.kind === 'videoinput');
    return {
      hasCamera: videoDevices.length > 0,
      hasFrontCamera: videoDevices.some(d => d.label.toLowerCase().includes('front')),
      hasRearCamera: videoDevices.some(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear')),
      cameras: videoDevices.length
    };
  }

  async requestCameraPermission() {
    try {
      const constraints = {
        video: { facingMode: this.facingMode },
        audio: false
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (this.video) {
        this.video.srcObject = this.stream;
        await this.video.play();
      }

      this.isActive = true;
      return { granted: true, stream: this.stream };
    } catch (error) {
      console.error('[Scanner] Permission request failed:', error);
      return {
        granted: false,
        error: error.name === 'NotAllowedError' ? 'permission_denied' : 'camera_unavailable'
      };
    }
  }

  stop() {
    if (!this.stream) {
      return;
    }

    this.stopScanning();
    this.stream.getTracks().forEach(track => track.stop());
    this.stream = null;
    this.isActive = false;
    this.torchEnabled = false;

    if (this.video) {
      this.video.srcObject = null;
    }
  }

  async switchCamera() {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.stream) {
          reject({ error: 'no_stream', message: 'No active stream' });
          return;
        }

        this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
        this.stream.getTracks().forEach(track => track.stop());

        const constraints = {
          video: { facingMode: this.facingMode },
          audio: false
        };

        this.stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (this.video) {
          this.video.srcObject = this.stream;
          await this.video.play();
        }

        resolve({ switched: true, facingMode: this.facingMode });
      } catch (error) {
        console.error('[Scanner] Switch camera failed:', error);
        reject({ error: 'switch_failed', message: error.message });
      }
    });
  }

  async enableTorch() {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.stream) {
          reject({ error: 'no_stream', message: 'No active stream' });
          return;
        }

        const track = this.stream.getVideoTracks()[0];
        if (!track) {
          reject({ error: 'no_track', message: 'No video track' });
          return;
        }

        const capabilities = track.getCapabilities?.() || {};
        if (!capabilities.torch) {
          reject({ error: 'torch_unsupported', message: 'Device does not support torch' });
          return;
        }

        await track.applyConstraints({ advanced: [{ torch: true }] });
        this.torchEnabled = true;
        resolve({ torchEnabled: true });
      } catch (error) {
        console.error('[Scanner] Enable torch failed:', error);
        reject({ error: 'torch_failed', message: error.message });
      }
    });
  }

  async disableTorch() {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.stream) {
          reject({ error: 'no_stream', message: 'No active stream' });
          return;
        }

        const track = this.stream.getVideoTracks()[0];
        if (!track) {
          reject({ error: 'no_track', message: 'No video track' });
          return;
        }

        await track.applyConstraints({ advanced: [{ torch: false }] });
        this.torchEnabled = false;
        resolve({ torchEnabled: false });
      } catch (error) {
        console.error('[Scanner] Disable torch failed:', error);
        reject({ error: 'torch_failed', message: error.message });
      }
    });
  }

  async toggleTorch() {
    return this.torchEnabled ? this.disableTorch() : this.enableTorch();
  }

  async restart() {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.torchEnabled = false;
        }

        this.facingMode = 'environment';

        const perm = await this.requestCameraPermission();
        if (!perm.granted) {
          reject({ error: 'permission_denied', message: 'Camera permission required' });
          return;
        }

        resolve({ restarted: true, facingMode: this.facingMode });
      } catch (error) {
        console.error('[Scanner] Restart failed:', error);
        reject({ error: 'restart_failed', message: error.message });
      }
    });
  }

  async destroy() {
    try {
      this.stopScanning();
      if (this.torchEnabled) {
        await this.disableTorch().catch(() => {});
      }
      this.stop();
      this.scanCallbacks = [];
      this.errorCallbacks = [];
    } catch (error) {
      console.error('[Scanner] Destroy failed:', error);
    }
  }

  getCapabilities() {
    return this.capabilities;
  }

  isStreamActive() {
    return this.isActive && this.stream !== null;
  }

  startScanning() {
    if (this.scanning || !this.isStreamActive()) {
      console.warn('[Scanner] Cannot start scanning - stream not active');
      return;
    }

    this.scanning = true;
    this.scanLoop();
  }

  stopScanning() {
    this.scanning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  scanLoop() {
    if (!this.scanning) {
      return;
    }

    this.scanFrame();
    this.animationFrameId = requestAnimationFrame(() => this.scanLoop());
  }

  async scanFrame() {
    if (!this.video || !this.scanCanvas || !this.scanContext) {
      return null;
    }

    try {
      if (this.video.readyState !== this.video.HAVE_ENOUGH_DATA) {
        return null;
      }

      this.scanCanvas.width = this.video.videoWidth;
      this.scanCanvas.height = this.video.videoHeight;

      this.scanContext.drawImage(this.video, 0, 0, this.scanCanvas.width, this.scanCanvas.height);

      let result = null;

      if (this.detectorReady && this.barcodeDetector) {
        result = await this.detectWithBarcodeDetector();
      } else if (this.jsqrLoaded && typeof jsQR !== 'undefined') {
        result = await this.detectWithJsQR();
      }

      if (result) {
        return this.handleScannedCode(result);
      }

      return null;
    } catch (error) {
      console.error('[Scanner] Scan frame error:', error);
      this.fireErrorCallbacks({ error: 'scan_failed', message: error.message });
      return null;
    }
  }

  async detectWithBarcodeDetector() {
    try {
      const barcodes = await this.barcodeDetector.detect(this.scanCanvas);
      if (barcodes && barcodes.length > 0) {
        return barcodes[0].rawValue;
      }
      return null;
    } catch (error) {
      console.error('[Scanner] BarcodeDetector error:', error);
      return null;
    }
  }

  async detectWithJsQR() {
    try {
      const imageData = this.scanContext.getImageData(0, 0, this.scanCanvas.width, this.scanCanvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code && code.data) {
        return code.data;
      }
      return null;
    } catch (error) {
      console.error('[Scanner] jsQR error:', error);
      return null;
    }
  }

  handleScannedCode(codeValue) {
    if (!codeValue || codeValue.trim() === '') {
      return null;
    }

    const now = Date.now();
    const timeSinceLastScan = now - this.lastScannedTime;

    if (codeValue === this.lastScannedCode && timeSinceLastScan < this.scanCooldown) {
      return null;
    }

    this.lastScannedCode = codeValue;
    this.lastScannedTime = now;

    this.fireScanCallbacks(codeValue);
    return codeValue;
  }

  onScan(callback) {
    if (typeof callback === 'function') {
      this.scanCallbacks.push(callback);
    }
  }

  onError(callback) {
    if (typeof callback === 'function') {
      this.errorCallbacks.push(callback);
    }
  }

  fireScanCallbacks(scannedCode) {
    this.scanCallbacks.forEach(callback => {
      try {
        callback(scannedCode);
      } catch (error) {
        console.error('[Scanner] Scan callback error:', error);
      }
    });
  }

  fireErrorCallbacks(error) {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (err) {
        console.error('[Scanner] Error callback error:', err);
      }
    });
  }
};
```