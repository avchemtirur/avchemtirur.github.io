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

        if (!this.stream) return;

        this.stream.getTracks().forEach(track => {

            track.stop();

        });

        this.stream = null;

        this.running = false;

    }

    isRunning() {

        return this.running;

    }

}

window.CouponScanner = new CouponScanner();

})(window, document);