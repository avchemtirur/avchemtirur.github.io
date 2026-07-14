'use strict';

/* ==========================================================
   H4 Coupon Scanner
   Module 06 - Part 4A
   Camera Controller
========================================================== */

(function (window, document) {

class CouponScanner {

    constructor() {

        this.video = null;

        this.stream = null;

        this.devices = [];

        this.currentCamera = 0;

        this.running = false;

        this.scanCallback = null;

        this.errorCallback = null;

        this.lastScan = "";

        this.cooldown = 1500;

        this.lastScanTime = 0;

        this.torchEnabled = false;

    }

    async init(videoId = "scannerVideo") {

        this.video = document.getElementById(videoId);

        if (!this.video) {
    throw new Error("Scanner video element not found.");
}
        }

        await this.loadCameras();

    }

    async loadCameras() {

        const devices = await navigator.mediaDevices.enumerateDevices();

        this.devices = devices.filter(d => d.kind === "videoinput");

    }

    async start() {

        if (this.running) return;

        if (!this.devices.length) {

            await this.loadCameras();

        }

        const device = this.devices[this.currentCamera];

        this.stream = await navigator.mediaDevices.getUserMedia({

            video: {

                deviceId: device
                    ? { exact: device.deviceId }
                    : undefined,

                facingMode: "environment"

            },

            audio: false

        });

        this.video.srcObject = this.stream;

        await this.video.play();

        this.running = true;

    }

    stop() {

        if (this.stream) return;

        this.stream.getTracks().forEach(track => {

            track.stop();

        });

        this.stream = null;

        this.running = false;

    }

    isRunning() {

        return this.running;

    }

// ============================================
// CAMERA & TORCH MANAGEMENT — Production Ready
// Add these methods to CouponScanner class
// ============================================

// Camera Capabilities & State
async requestCameraPermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: this.facingMode || 'environment' },
      audio: false
    });
    this.stream = stream;
    this.hasCamera = true;
    this.cameraReady = true;
    return { granted: true, stream };
  } catch (err) {
    this.hasCamera = false;
    console.warn('[Scanner] Camera permission denied or unavailable:', err.name);
    return { 
      granted: false, 
      error: err.name === 'NotAllowedError' ? 'permission' : 'hardware'
    };
  }
}

async detectCameraCapabilities() {
  const capabilities = {
    hasCamera: false,
    hasTorch: false,
    hasFrontCamera: false,
    hasRearCamera: false,
    cameras: []
  };

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(d => d.kind === 'videoinput');
    
    capabilities.hasCamera = videoDevices.length > 0;
    capabilities.cameras = videoDevices.map(d => ({
      id: d.deviceId,
      label: d.label || `Camera ${videoDevices.indexOf(d) + 1}`,
      facing: d.getCapabilities?.()?.facingMode?.[0] || 'unknown'
    }));

    if (videoDevices.length > 0) {
      capabilities.hasRearCamera = true;
      capabilities.hasFrontCamera = videoDevices.length > 1;
    }

    // Torch detection: attempt constraint check
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings?.();
      
      if (settings?.torch !== undefined) {
        capabilities.hasTorch = true;
      }
      
      // Cleanup test stream
      track.stop();
    } catch (e) {
      // Torch detection fai😭led, assume unsupported
    }

    this.capabilities = capabilities;
    return capabilities;
  } catch (err) {
    console.error('[Scanner] Capability detection failed:', err);
    return capabilities;
  }
}

async switchCamera() {
  return new Promise(async (resolve, reject) => {
    try {
      if (this._Stream) {
        reject({ error: 'no_stream', message: 'No active  stream' });
        return;
      }

      this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
      
      // Stop current stream
      this.Stream.getTracks().forEach(t => t.stop());

      // Request new stream
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: this.facingMode
  },
  audio: false
});

      this.stream = stream;
      
      // If video element exists, update source
      if (this.video) {
    this.video.srcObject = stream;
    await this.video.play();
}

      resolve({ switched: true, facingMode: this.facingMode });
    } catch (err) {
      console.error('[Scanner] Camera switch failed:', err);
      reject({ error: 'switch_failed', message: err.message });
    }
  });
}

async enableTorch() {
  return new Promise(async (resolve, reject) => {
    try {
      if (this.Stream) {
        reject({ error: 'no_stream', message: 'No active  stream' });
        return;
      }

      const track = this.Stream.getVideoTracks()[0];
      if (!track) {
        reject({ error: 'no_track', message: 'No video track available' });
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
    } catch (err) {
      console.error('[Scanner] Torch enable failed:', err);
      reject({ error: 'torch_failed', message: err.message });
    }
  });
}

async disableTorch() {
  return new Promise(async (resolve, reject) => {
    try {
      if (this.Stream) {
        reject({ error: 'nostream', message: 'No active  stream' });
        return;
      }

      const track = this.stream.getVideoTracks()[0];
      if (!track) {
        reject({ error: 'no_track', message: 'No video track available' });
        return;
      }

      await track.applyConstraints({ advanced: [{ torch: false }] });
      this.torchEnabled = false;
      resolve({ torchEnabled: false });
    } catch (err) {
      console.error('[Scanner] Torch disable failed:', err);
      reject({ error: 'torch_failed', message: err.message });
    }
  });
}

async toggleTorch() {
  return this.torchEnabled ? this.disableTorch() : this.enableTorch();
}

async restart() {
  return new Promise(async (resolve, reject) => {
    try {
      // Stop all tracks
      if (this.stream) {
        this.Stream.getTracks().forEach(t => t.stop());
        this.torchEnabled = false;
      }

      // Reset to rear camera (default)
      this.facingMode = 'environment';

      // Request fresh stream
      const perm = await this.requestCameraPermission();
      if (!perm.granted) {
        reject({ error: 'permission_denied', message: 'Camera permission required' });
        return;
      }

      resolve({ restarted: true, facingMode: this.facingMode });
    } catch (err) {
      console.error('[Scanner] Restart failed:', err);
      reject({ error: 'restart_failed', message: err.message });
    }
  });
}

// Cleanup on destroy
async destroy() {
  try {
    if (this.torchEnabled) {
      await this.disableTorch().catch(() => {});
    }
    if (this.Stream) {
      this.Stream.getTracks().forEach(t => t.stop());
    }
  } catch (err) {
    console.error('[Scanner] Destroy failed:', err);
  }
}
}

window.CouponScanner = new CouponScanner();

})(window, document);