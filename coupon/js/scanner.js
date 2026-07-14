window.CouponScanner = class {
  constructor(options = {}) {
    this.video = null;
    this.stream = null;
    this.facingMode = options.facingMode || 'environment';
    this.torchEnabled = false;
    this.isActive = false;
    this.capabilities = {};
  }

  async init(videoElement) {
    if (!videoElement) {
      throw new Error('Video element required');
    }

    this.video = videoElement;

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.capabilities = this.detectCapabilities(devices);
      
      return await this.requestCameraPermission();
    } catch (error) {
      console.error('[Scanner] Init failed:', error);
      throw error;
    }
  }

  detectCapabilities(devices) {
    const videoDevices = devices.filter(d => d.kind === 'videoinput');
    return {
      hasCamera: videoDevices.length > 0,
      hasFrontCamera: videoDevices.some(d => d.label.includes('front')),
      hasRearCamera: videoDevices.some(d => d.label.includes('back') || d.label.includes('rear')),
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
      if (this.torchEnabled) {
        await this.disableTorch().catch(() => {});
      }
      this.stop();
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
};