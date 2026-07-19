<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reward Management – Admin Panel</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet" />
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    <style>
        /* ============================================================
                   DESIGN TOKENS
                   ============================================================ */
        :root {
            --primary: #6C3B9E;
            --primary-light: #8B5CF6;
            --primary-dark: #5B2B8E;
            --primary-container: #EDE7F6;
            --secondary: #34A853;
            --error: #EA4335;
            --warning: #FBBC04;
            --bg: #F3F4F6;
            --surface: #FFFFFF;
            --on-surface: #1F1F1F;
            --on-surface-variant: #5F6368;
            --sidebar-bg: #1E1B2E;
            --sidebar-hover: #2D2A44;
            --sidebar-active: #6C3B9E;
            --sidebar-text: #A8A4C2;
            --sidebar-text-active: #FFFFFF;
            --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            --radius-sm: 4px;
            --radius-md: 8px;
            --radius-lg: 12px;
            --radius-xl: 16px;
            --radius-full: 9999px;
            --shadow-1: 0 2px 8px rgba(0, 0, 0, 0.06);
            --shadow-3: 0 6px 20px rgba(0, 0, 0, 0.08);
            --shadow-5: 0 12px 40px rgba(0, 0, 0, 0.12);
            --space-xxs: 2px;
            --space-xs: 4px;
            --space-s: 8px;
            --space-m: 16px;
            --space-l: 24px;
            --space-xl: 32px;
            --space-xxl: 48px;
            --sidebar-width: 260px;
            --header-height: 64px;
        }

        /* ============================================================
                   RESET & BASE
                   ============================================================ */
        *,
        *::before,
        *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        html {
            scroll-behavior: smooth;
        }
        body {
            font-family: var(--font-family);
            background: var(--bg);
            color: var(--on-surface);
            line-height: 1.6;
            display: flex;
            min-height: 100vh;
        }

        /* ============================================================
                   SIDEBAR
                   ============================================================ */
        .sidebar {
            width: var(--sidebar-width);
            background: var(--sidebar-bg);
            color: var(--sidebar-text);
            height: 100vh;
            position: sticky;
            top: 0;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            z-index: 100;
            transition: transform 0.3s ease;
        }
        .sidebar-brand {
            padding: var(--space-l) var(--space-m);
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            display: flex;
            align-items: center;
            gap: var(--space-s);
        }
        .sidebar-brand .logo {
            font-size: 24px;
            font-weight: 700;
            color: #fff;
            letter-spacing: -0.5px;
        }
        .sidebar-brand .logo span {
            color: var(--primary-light);
        }
        .sidebar-brand .badge {
            font-size: 10px;
            background: var(--primary);
            color: #fff;
            padding: 2px 8px;
            border-radius: var(--radius-full);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .sidebar-nav {
            flex: 1;
            padding: var(--space-m) 0;
        }
        .sidebar-nav .nav-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: rgba(255, 255, 255, 0.3);
            padding: var(--space-m) var(--space-m) var(--space-xs);
            font-weight: 600;
        }
        .sidebar-nav a {
            display: flex;
            align-items: center;
            gap: var(--space-m);
            padding: 10px var(--space-m);
            color: var(--sidebar-text);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: 0.2s;
            border-left: 3px solid transparent;
            margin: 1px 0;
            cursor: pointer;
        }
        .sidebar-nav a:hover {
            background: var(--sidebar-hover);
            color: #fff;
        }
        .sidebar-nav a.active {
            background: var(--sidebar-hover);
            color: var(--sidebar-text-active);
            border-left-color: var(--primary-light);
        }
        .sidebar-nav a i {
            width: 20px;
            text-align: center;
            font-size: 16px;
            opacity: 0.7;
        }
        .sidebar-nav a.active i {
            opacity: 1;
        }
        .sidebar-nav a .nav-count {
            margin-left: auto;
            font-size: 11px;
            background: rgba(255, 255, 255, 0.08);
            padding: 0 8px;
            border-radius: var(--radius-full);
            color: var(--sidebar-text);
        }
        .sidebar-nav a.active .nav-count {
            background: var(--primary);
            color: #fff;
        }

        .sidebar-footer {
            padding: var(--space-m);
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            font-size: 12px;
            color: rgba(255, 255, 255, 0.3);
            text-align: center;
        }

        /* ============================================================
                   MAIN CONTENT
                   ============================================================ */
        .main-content {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
        }

        /* Header */
        .top-header {
            background: var(--surface);
            padding: 0 var(--space-xl);
            height: var(--header-height);
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #e9ecf0;
            position: sticky;
            top: 0;
            z-index: 50;
            flex-shrink: 0;
        }
        .top-header .left {
            display: flex;
            align-items: center;
            gap: var(--space-m);
        }
        .top-header .menu-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 22px;
            color: var(--on-surface);
            cursor: pointer;
            padding: 4px;
        }
        .top-header .page-title {
            font-size: 18px;
            font-weight: 600;
        }
        .top-header .page-title span {
            color: var(--on-surface-variant);
            font-weight: 400;
            font-size: 14px;
        }
        .top-header .right {
            display: flex;
            align-items: center;
            gap: var(--space-m);
        }
        .top-header .right .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: var(--primary-container);
            color: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
        }

        /* Page Content */
        .page-content {
            padding: var(--space-xl);
            flex: 1;
        }

        /* ============================================================
                   REWARD FORM
                   ============================================================ */
        .form-container {
            max-width: 820px;
            margin: 0 auto;
        }
        .form-card {
            background: var(--surface);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-1);
            padding: var(--space-xl);
            border: 1px solid #f0f2f5;
        }
        .form-card .form-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: var(--space-l);
            display: flex;
            align-items: center;
            gap: var(--space-s);
        }
        .form-card .form-title .tag {
            font-size: 12px;
            font-weight: 500;
            background: var(--primary-container);
            color: var(--primary);
            padding: 0 12px;
            border-radius: var(--radius-full);
            line-height: 26px;
        }

        .form-group {
            margin-bottom: var(--space-l);
        }
        .form-group label {
            display: block;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: var(--space-xs);
            color: var(--on-surface);
        }
        .form-group label .required {
            color: var(--error);
        }
        .form-group .hint {
            font-size: 12px;
            color: var(--on-surface-variant);
            margin-top: 4px;
        }

        .form-control {
            width: 100%;
            padding: 10px 14px;
            border: 2px solid #e9ecf0;
            border-radius: var(--radius-md);
            font-size: 14px;
            font-family: var(--font-family);
            transition: 0.2s;
            background: var(--surface);
            color: var(--on-surface);
        }
        .form-control:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 4px rgba(108, 59, 158, 0.12);
        }
        .form-control::placeholder {
            color: #B0B3B8;
        }

        select.form-control {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235F6368' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 14px center;
            padding-right: 36px;
        }

        textarea.form-control {
            resize: vertical;
            min-height: 100px;
        }

        /* Image upload area */
        .image-upload-area {
            display: flex;
            align-items: center;
            gap: var(--space-m);
            flex-wrap: wrap;
        }
        .image-preview {
            width: 100px;
            height: 100px;
            border-radius: var(--radius-md);
            background: var(--bg);
            border: 2px dashed #d0d3d8;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: #B0B3B8;
            overflow: hidden;
            flex-shrink: 0;
            position: relative;
        }
        .image-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .image-preview .placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
            color: #B0B3B8;
        }
        .image-preview .placeholder i {
            font-size: 28px;
            margin-bottom: 4px;
        }

        .image-actions {
            display: flex;
            gap: var(--space-s);
            flex-wrap: wrap;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            gap: var(--space-s);
            padding: 8px 20px;
            border-radius: var(--radius-md);
            font-size: 13px;
            font-weight: 600;
            font-family: var(--font-family);
            border: none;
            cursor: pointer;
            transition: 0.2s;
            text-decoration: none;
            background: var(--bg);
            color: var(--on-surface);
        }
        .btn:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-1);
        }
        .btn-primary {
            background: var(--primary);
            color: #fff;
        }
        .btn-primary:hover {
            background: var(--primary-dark);
        }
        .btn-outline {
            background: transparent;
            border: 2px solid #e9ecf0;
            color: var(--on-surface);
        }
        .btn-outline:hover {
            border-color: var(--primary);
            color: var(--primary);
        }
        .btn-success {
            background: var(--secondary);
            color: #fff;
        }
        .btn-success:hover {
            background: #2D9248;
        }
        .btn-sm {
            padding: 5px 14px;
            font-size: 12px;
        }

        /* Color Picker row */
        .color-picker-row {
            display: flex;
            align-items: center;
            gap: var(--space-m);
            flex-wrap: wrap;
        }
        .color-picker-row input[type="color"] {
            width: 48px;
            height: 48px;
            border: 2px solid #e9ecf0;
            border-radius: var(--radius-md);
            padding: 2px;
            cursor: pointer;
            background: var(--surface);
        }
        .color-picker-row .color-hex {
            font-size: 13px;
            font-weight: 500;
            color: var(--on-surface-variant);
            background: var(--bg);
            padding: 2px 12px;
            border-radius: var(--radius-sm);
        }

        /* Slider row */
        .slider-row {
            display: flex;
            align-items: center;
            gap: var(--space-m);
            flex-wrap: wrap;
        }
        .slider-row input[type="range"] {
            flex: 1;
            min-width: 120px;
            height: 6px;
            -webkit-appearance: none;
            appearance: none;
            background: #e9ecf0;
            border-radius: var(--radius-full);
            outline: none;
        }
        .slider-row input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--primary);
            cursor: pointer;
            border: 2px solid #fff;
            box-shadow: var(--shadow-1);
        }
        .slider-row .slider-value {
            font-weight: 600;
            font-size: 14px;
            min-width: 48px;
            text-align: center;
            color: var(--on-surface);
        }

        /* Dimension inputs */
        .dimension-row {
            display: flex;
            align-items: center;
            gap: var(--space-m);
            flex-wrap: wrap;
        }
        .dimension-row .dim-group {
            display: flex;
            align-items: center;
            gap: var(--space-xs);
        }
        .dimension-row .dim-group label {
            font-weight: 500;
            font-size: 13px;
            color: var(--on-surface-variant);
            margin: 0;
        }
        .dimension-row .dim-group input {
            width: 80px;
            padding: 6px 10px;
            border: 2px solid #e9ecf0;
            border-radius: var(--radius-sm);
            font-size: 13px;
            font-family: var(--font-family);
            text-align: center;
        }
        .dimension-row .dim-group input:focus {
            outline: none;
            border-color: var(--primary);
        }

        /* Animation select row */
        .anim-row {
            display: flex;
            align-items: center;
            gap: var(--space-m);
            flex-wrap: wrap;
        }
        .anim-row select {
            width: 160px;
        }
        .anim-row .anim-tags {
            display: flex;
            gap: var(--space-xs);
            flex-wrap: wrap;
        }
        .anim-row .anim-tags span {
            font-size: 12px;
            background: var(--bg);
            padding: 2px 10px;
            border-radius: var(--radius-full);
            color: var(--on-surface-variant);
        }

        /* Rich text editor mock */
        .rich-editor {
            border: 2px solid #e9ecf0;
            border-radius: var(--radius-md);
            overflow: hidden;
        }
        .rich-editor .toolbar {
            display: flex;
            gap: var(--space-xs);
            padding: var(--space-s) var(--space-m);
            background: var(--bg);
            border-bottom: 1px solid #e9ecf0;
            flex-wrap: wrap;
        }
        .rich-editor .toolbar button {
            background: none;
            border: none;
            padding: 4px 8px;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-size: 14px;
            color: var(--on-surface-variant);
            transition: 0.2s;
        }
        .rich-editor .toolbar button:hover {
            background: var(--surface);
            color: var(--on-surface);
        }
        .rich-editor .toolbar .sep {
            width: 1px;
            background: #d0d3d8;
            margin: 0 4px;
        }
        .rich-editor textarea {
            width: 100%;
            border: none;
            padding: var(--space-m);
            font-size: 14px;
            font-family: var(--font-family);
            resize: vertical;
            min-height: 100px;
            color: var(--on-surface);
            background: var(--surface);
        }
        .rich-editor textarea:focus {
            outline: none;
        }

        /* Preview box */
        .preview-box {
            background: var(--bg);
            border-radius: var(--radius-md);
            padding: var(--space-l);
            border: 2px dashed #d0d3d8;
            min-height: 120px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            transition: 0.3s;
            position: relative;
        }
        .preview-box .preview-label {
            font-size: 12px;
            font-weight: 600;
            color: var(--on-surface-variant);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: var(--space-s);
        }
        .preview-box .preview-content {
            font-size: 18px;
            font-weight: 600;
            color: var(--on-surface);
        }
        .preview-box .preview-content .sub {
            font-size: 14px;
            font-weight: 400;
            color: var(--on-surface-variant);
        }
        .preview-box .preview-image {
            width: 80px;
            height: 80px;
            border-radius: var(--radius-md);
            background: var(--primary-container);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: var(--primary);
            margin-bottom: var(--space-s);
        }

        .form-actions {
            display: flex;
            gap: var(--space-m);
            margin-top: var(--space-l);
            padding-top: var(--space-l);
            border-top: 1px solid #e9ecf0;
            flex-wrap: wrap;
        }
        .form-actions .btn {
            padding: 10px 32px;
            font-size: 14px;
        }

        /* ============================================================
                   MODULES GRID (for sidebar preview)
                   ============================================================ */
        .modules-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: var(--space-s);
            margin-top: var(--space-m);
            padding: var(--space-m);
            background: var(--bg);
            border-radius: var(--radius-md);
        }
        .modules-grid .module-chip {
            font-size: 13px;
            padding: 6px 14px;
            background: var(--surface);
            border-radius: var(--radius-full);
            border: 1px solid #e9ecf0;
            display: flex;
            align-items: center;
            gap: var(--space-s);
            color: var(--on-surface-variant);
        }
        .modules-grid .module-chip i {
            font-size: 14px;
            color: var(--primary-light);
        }

        /* ============================================================
                   RESPONSIVE
                   ============================================================ */
        @media (max-width: 768px) {
            .sidebar {
                position: fixed;
                transform: translateX(-100%);
                height: 100vh;
                width: 280px;
                box-shadow: var(--shadow-5);
                transition: transform 0.3s ease;
            }
            .sidebar.open {
                transform: translateX(0);
            }
            .top-header .menu-toggle {
                display: block;
            }
            .page-content {
                padding: var(--space-m);
            }
            .form-card {
                padding: var(--space-m);
            }
            .image-upload-area {
                flex-direction: column;
                align-items: flex-start;
            }
            .color-picker-row,
            .slider-row,
            .dimension-row,
            .anim-row {
                flex-direction: column;
                align-items: flex-start;
            }
            .dimension-row .dim-group input {
                width: 100px;
            }
            .form-actions {
                flex-direction: column;
            }
            .form-actions .btn {
                width: 100%;
                justify-content: center;
            }
            .top-header .page-title span {
                display: none;
            }
        }

        /* overlay for mobile */
        .sidebar-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 99;
        }
        .sidebar-overlay.active {
            display: block;
        }

        /* ============================================================
                   ANIMATION PREVIEW
                   ============================================================ */
        .anim-preview-box {
            display: inline-block;
            padding: 12px 24px;
            background: var(--primary);
            color: #fff;
            border-radius: var(--radius-md);
            font-weight: 600;
            transition: 0.4s;
            cursor: default;
        }
        .anim-preview-box.fade {
            animation: fadeAnim 1.2s ease infinite;
        }
        .anim-preview-box.slide {
            animation: slideAnim 1.2s ease infinite;
        }
        .anim-preview-box.zoom {
            animation: zoomAnim 1.2s ease infinite;
        }
        .anim-preview-box.bounce {
            animation: bounceAnim 1.2s ease infinite;
        }
        .anim-preview-box.flip {
            animation: flipAnim 1.2s ease infinite;
        }
        .anim-preview-box.rotate {
            animation: rotateAnim 1.2s ease infinite;
        }

        @keyframes fadeAnim {
            0%,
            100% {
                opacity: 1;
            }
            50% {
                opacity: 0.3;
            }
        }
        @keyframes slideAnim {
            0%,
            100% {
                transform: translateX(0);
            }
            50% {
                transform: translateX(20px);
            }
        }
        @keyframes zoomAnim {
            0%,
            100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.2);
            }
        }
        @keyframes bounceAnim {
            0%,
            100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-12px);
            }
        }
        @keyframes flipAnim {
            0%,
            100% {
                transform: rotateY(0);
            }
            50% {
                transform: rotateY(180deg);
            }
        }
        @keyframes rotateAnim {
            0%,
            100% {
                transform: rotate(0deg);
            }
            50% {
                transform: rotate(45deg);
            }
        }
    </style>
</head>
<body>

    <!-- ============================================================
    SIDEBAR OVERLAY (mobile)
    ============================================================ -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- ============================================================
    SIDEBAR
    ============================================================ -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
            <span class="logo">🎯 <span>Reward</span>Hub</span>
            <span class="badge">v2</span>
        </div>
        <nav class="sidebar-nav">
            <div class="nav-label">Modules</div>

            <a href="#" class="active" data-module="reward">
                <i class="fas fa-gift"></i> Reward Management
                <span class="nav-count">4</span>
            </a>
            <a href="#" data-module="content">
                <i class="fas fa-file-alt"></i> Content Management
                <span class="nav-count">6</span>
            </a>
            <a href="#" data-module="points">
                <i class="fas fa-coins"></i> Points Management
                <span class="nav-count">5</span>
            </a>
            <a href="#" data-module="customer">
                <i class="fas fa-users"></i> Customer Management
                <span class="nav-count">4</span>
            </a>
            <a href="#" data-module="product">
                <i class="fas fa-box"></i> Product Management
                <span class="nav-count">4</span>
            </a>
            <a href="#" data-module="design">
                <i class="fas fa-palette"></i> Design Studio
                <span class="nav-count">9</span>
            </a>
            <a href="#" data-module="media">
                <i class="fas fa-images"></i> Media Library ⭐
                <span class="nav-count">4</span>
            </a>
            <a href="#" data-module="settings">
                <i class="fas fa-cog"></i> System Settings
                <span class="nav-count">13</span>
            </a>
        </nav>
        <div class="sidebar-footer">
            &copy; 2026 RewardHub • v2.0
        </div>
    </aside>

    <!-- ============================================================
    MAIN CONTENT
    ============================================================ -->
    <main class="main-content">

        <!-- Top Header -->
        <header class="top-header">
            <div class="left">
                <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">
                    <i class="fas fa-bars"></i>
                </button>
                <span class="page-title">
                    Reward Management
                    <span>— Create &amp; customize rewards</span>
                </span>
            </div>
            <div class="right">
                <span style="font-size:13px;color:var(--on-surface-variant);">Admin</span>
                <div class="avatar">A</div>
            </div>
        </header>

        <!-- Page Content -->
        <div class="page-content">

            <!-- ============================================================
            REWARD FORM
            ============================================================ -->
            <div class="form-container" id="rewardForm">
                <div class="form-card">
                    <div class="form-title">
                        <i class="fas fa-pen-fancy" style="color:var(--primary);"></i> Create New Reward
                        <span class="tag">Draft</span>
                    </div>

                    <!-- Reward Name -->
                    <div class="form-group">
                        <label>Reward Name <span class="required">*</span></label>
                        <input type="text" class="form-control" id="rewardName" placeholder="e.g. Premium Voucher, Gift Card, Merchandise" value="Summer Voucher 2026" />
                    </div>

                    <!-- Reward Image -->
                    <div class="form-group">
                        <label>Reward Image</label>
                        <div class="image-upload-area">
                            <div class="image-preview" id="imagePreview">
                                <div class="placeholder">
                                    <i class="fas fa-image"></i>
                                    <span>No image</span>
                                </div>
                            </div>
                            <div class="image-actions">
                                <button class="btn btn-primary btn-sm" onclick="uploadImage()">
                                    <i class="fas fa-upload"></i> Upload
                                </button>
                                <button class="btn btn-outline btn-sm" onclick="changeImage()">
                                    <i class="fas fa-exchange-alt"></i> Change
                                </button>
                            </div>
                        </div>
                        <div class="hint">Recommended: 400×300px, PNG or JPG, max 2MB</div>
                    </div>

                    <!-- Description (Rich Text Editor) -->
                    <div class="form-group">
                        <label>Description</label>
                        <div class="rich-editor">
                            <div class="toolbar">
                                <button title="Bold"><b>B</b></button>
                                <button title="Italic"><i>I</i></button>
                                <button title="Underline"><u>U</u></button>
                                <span class="sep"></span>
                                <button title="Bullet list"><i class="fas fa-list-ul"></i></button>
                                <button title="Numbered list"><i class="fas fa-list-ol"></i></button>
                                <span class="sep"></span>
                                <button title="Link"><i class="fas fa-link"></i></button>
                                <button title="Image"><i class="fas fa-image"></i></button>
                                <span style="margin-left:auto;font-size:12px;color:var(--on-surface-variant);">Rich Text</span>
                            </div>
                            <textarea id="rewardDescription" placeholder="Describe the reward in detail...">Get 20% off on your next purchase. Valid for 30 days. T&amp;C apply.</textarea>
                        </div>
                    </div>

                    <!-- Text Color -->
                    <div class="form-group">
                        <label>Text Color</label>
                        <div class="color-picker-row">
                            <input type="color" id="textColor" value="#1F1F1F" />
                            <span class="color-hex" id="textColorHex">#1F1F1F</span>
                            <span style="font-size:13px;color:var(--on-surface-variant);">← Pick a color</span>
                        </div>
                    </div>

                    <!-- Font Family -->
                    <div class="form-group">
                        <label>Font Family</label>
                        <select class="form-control" id="fontFamily">
                            <option value="Inter">Inter</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Poppins" selected>Poppins</option>
                            <option value="Noto Sans Malayalam">Noto Sans Malayalam</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Arial">Arial</option>
                        </select>
                    </div>

                    <!-- Font Size -->
                    <div class="form-group">
                        <label>Font Size</label>
                        <div class="slider-row">
                            <input type="range" id="fontSize" min="12" max="36" value="18" />
                            <span class="slider-value" id="fontSizeValue">18px</span>
                        </div>
                    </div>

                    <!-- Image Width & Height -->
                    <div class="form-group">
                        <label>Image Dimensions</label>
                        <div class="dimension-row">
                            <div class="dim-group">
                                <label>Width</label>
                                <input type="number" id="imgWidth" value="400" min="50" max="2000" /> px
                            </div>
                            <div class="dim-group">
                                <label>Height</label>
                                <input type="number" id="imgHeight" value="300" min="50" max="2000" /> px
                            </div>
                            <span style="font-size:13px;color:var(--on-surface-variant);">(recommended 400×300)</span>
                        </div>
                    </div>

                    <!-- Animation -->
                    <div class="form-group">
                        <label>Animation</label>
                        <div class="anim-row">
                            <select class="form-control" id="animationSelect" style="width:180px;">
                                <option value="none">None</option>
                                <option value="fade" selected>Fade</option>
                                <option value="slide">Slide</option>
                                <option value="zoom">Zoom</option>
                                <option value="bounce">Bounce</option>
                                <option value="flip">Flip</option>
                                <option value="rotate">Rotate</option>
                            </select>
                            <div class="anim-tags">
                                <span>Speed: 1.2s</span>
                                <span>Delay: 0ms</span>
                                <span>Repeat: infinite</span>
                            </div>
                        </div>
                    </div>

                    <!-- Preview -->
                    <div class="form-group">
                        <label>Preview</label>
                        <div class="preview-box" id="previewBox">
                            <div class="preview-label">
                                <i class="fas fa-eye"></i> Live Preview
                            </div>
                            <div class="preview-content" id="previewContent">
                                <div class="preview-image" id="previewImageIcon">
                                    <i class="fas fa-gift"></i>
                                </div>
                                <div id="previewText">Summer Voucher 2026</div>
                                <div class="sub">20% off • Valid for 30 days</div>
                            </div>
                            <div style="margin-top:var(--space-s);font-size:12px;color:var(--on-surface-variant);">
                                <span id="previewAnimTag">Animation: Fade</span>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="form-actions">
                        <button class="btn btn-success" onclick="saveReward()">
                            <i class="fas fa-save"></i> Save Reward
                        </button>
                        <button class="btn btn-outline" onclick="resetForm()">
                            <i class="fas fa-undo"></i> Reset
                        </button>
                        <button class="btn btn-outline" style="margin-left:auto;" onclick="previewFull()">
                            <i class="fas fa-expand"></i> Full Preview
                        </button>
                    </div>
                </div>

                <!-- Quick module reference -->
                <div style="margin-top:var(--space-xl);">
                    <div style="font-size:14px;font-weight:600;color:var(--on-surface-variant);margin-bottom:var(--space-s);">
                        <i class="fas fa-th-large"></i> All Modules
                    </div>
                    <div class="modules-grid">
                        <span class="module-chip"><i class="fas fa-file-alt"></i> Content Management</span>
                        <span class="module-chip"><i class="fas fa-gift"></i> Reward Management</span>
                        <span class="module-chip"><i class="fas fa-coins"></i> Points Management</span>
                        <span class="module-chip"><i class="fas fa-users"></i> Customer Management</span>
                        <span class="module-chip"><i class="fas fa-box"></i> Product Management</span>
                        <span class="module-chip"><i class="fas fa-palette"></i> Design Studio</span>
                        <span class="module-chip"><i class="fas fa-images"></i> Media Library ⭐</span>
                        <span class="module-chip"><i class="fas fa-cog"></i> System Settings</span>
                    </div>
                    <!-- Sub-modules -->
                    <div style="display:flex;flex-wrap:wrap;gap:var(--space-xs);margin-top:var(--space-s);padding:0 var(--space-s);">
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Banners</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">News</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Pages</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">T&C</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Privacy</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">FAQ</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Reward Categories</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Reward Stock</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Redemption Rules</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Signup Bonus</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Scan Points</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Referral Points</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Expiry Rules</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Customers</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Wallet</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Transactions</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Reward History</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Products</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Categories</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Coupon Series</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">QR Codes</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Design Studio</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Media Library</span>
                        <span style="font-size:12px;color:var(--on-surface-variant);background:var(--surface);padding:2px 12px;border-radius:var(--radius-full);border:1px solid #e9ecf0;">Settings</span>
                    </div>
                </div>
            </div>

        </div>
    </main>

    <!-- ============================================================
    JAVASCRIPT
    ============================================================ -->
    <script>
        // ============================================================
        // SIDEBAR TOGGLE (mobile)
        // ============================================================
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        function toggleSidebar() {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        }

        menuToggle.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);

        // Close sidebar on link click (mobile)
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                // Highlight active
                document.querySelectorAll('.sidebar-nav a').forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Update page title
                const name = this.textContent.trim().replace(/\d/g, '').trim();
                const titleEl = document.querySelector('.top-header .page-title');
                if (titleEl) {
                    const span = titleEl.querySelector('span');
                    titleEl.innerHTML = name + ' <span>— ' + name.toLowerCase() + ' module</span>';
                }

                if (window.innerWidth <= 768) {
                    toggleSidebar();
                }
            });
        });

        // ============================================================
        // COLOR PICKER
        // ============================================================
        const colorInput = document.getElementById('textColor');
        const colorHex = document.getElementById('textColorHex');

        colorInput.addEventListener('input', function() {
            colorHex.textContent = this.value;
            updatePreview();
        });

        // ============================================================
        // FONT FAMILY
        // ============================================================
        const fontFamilySelect = document.getElementById('fontFamily');
        fontFamilySelect.addEventListener('change', updatePreview);

        // ============================================================
        // FONT SIZE SLIDER
        // ============================================================
        const fontSizeSlider = document.getElementById('fontSize');
        const fontSizeValue = document.getElementById('fontSizeValue');

        fontSizeSlider.addEventListener('input', function() {
            fontSizeValue.textContent = this.value + 'px';
            updatePreview();
        });

        // ============================================================
        // IMAGE DIMENSIONS
        // ============================================================
        document.getElementById('imgWidth').addEventListener('input', updatePreview);
        document.getElementById('imgHeight').addEventListener('input', updatePreview);

        // ============================================================
        // ANIMATION
        // ============================================================
        const animSelect = document.getElementById('animationSelect');
        animSelect.addEventListener('change', function() {
            const anim = this.value;
            const tag = document.getElementById('previewAnimTag');
            const names = {
                none: 'None',
                fade: 'Fade',
                slide: 'Slide',
                zoom: 'Zoom',
                bounce: 'Bounce',
                flip: 'Flip',
                rotate: 'Rotate'
            };
            tag.textContent = 'Animation: ' + (names[anim] || anim);
            updatePreview();
        });

        // ============================================================
        // REWARD NAME
        // ============================================================
        document.getElementById('rewardName').addEventListener('input', updatePreview);

        // ============================================================
        // PREVIEW UPDATE
        // ============================================================
        function updatePreview() {
            const name = document.getElementById('rewardName').value || 'Reward Name';
            const color = document.getElementById('textColor').value;
            const font = document.getElementById('fontFamily').value;
            const size = document.getElementById('fontSize').value;
            const anim = document.getElementById('animationSelect').value;

            const previewText = document.getElementById('previewText');
            const previewIcon = document.getElementById('previewImageIcon');
            const previewBox = document.getElementById('previewBox');

            // Text styling
            previewText.style.color = color;
            previewText.style.fontFamily = font;
            previewText.style.fontSize = size + 'px';
            previewText.textContent = name;

            // Animation
            const animBox = previewBox;
            // Remove all animation classes
            const classes = ['fade', 'slide', 'zoom', 'bounce', 'flip', 'rotate'];
            classes.forEach(c => animBox.classList.remove(c));
            if (anim !== 'none') {
                animBox.classList.add(anim);
            } else {
                animBox.style.animation = 'none';
                // re-enable after a tick
                setTimeout(() => {
                    animBox.style.animation = '';
                }, 10);
            }

            // Image dimensions (just visual feedback)
            const w = document.getElementById('imgWidth').value || 400;
            const h = document.getElementById('imgHeight').value || 300;
            previewIcon.style.width = Math.min(80, w / 5) + 'px';
            previewIcon.style.height = Math.min(80, h / 5) + 'px';
        }

        // ============================================================
        // IMAGE UPLOAD MOCK
        // ============================================================
        function uploadImage() {
            // Simulate file upload
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `
                        <img src="https://placehold.co/400x300/6C3B9E/FFFFFF?text=Reward" alt="Reward image" />
                    `;
            // Also update the preview icon
            const icon = document.getElementById('previewImageIcon');
            icon.innerHTML = '<i class="fas fa-check-circle" style="color:#34A853;font-size:32px;"></i>';
            icon.style.background = '#E6F4EA';
            showToast('Image uploaded successfully!');
        }

        function changeImage() {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `
                        <div class="placeholder">
                            <i class="fas fa-image"></i>
                            <span>No image</span>
                        </div>
                    `;
            const icon = document.getElementById('previewImageIcon');
            icon.innerHTML = '<i class="fas fa-gift"></i>';
            icon.style.background = 'var(--primary-container)';
            showToast('Image removed. You can upload a new one.');
        }

        // ============================================================
        // SAVE / RESET
        // ============================================================
        function saveReward() {
            const name = document.getElementById('rewardName').value;
            if (!name.trim()) {
                showToast('Please enter a reward name.', 'error');
                return;
            }
            showToast('✅ Reward "' + name + '" saved successfully!', 'success');
        }

        function resetForm() {
            document.getElementById('rewardName').value = 'Summer Voucher 2026';
            document.getElementById('textColor').value = '#1F1F1F';
            document.getElementById('textColorHex').textContent = '#1F1F1F';
            document.getElementById('fontFamily').value = 'Poppins';
            document.getElementById('fontSize').value = '18';
            document.getElementById('fontSizeValue').textContent = '18px';
            document.getElementById('imgWidth').value = '400';
            document.getElementById('imgHeight').value = '300';
            document.getElementById('animationSelect').value = 'fade';
            document.getElementById('rewardDescription').value = 'Get 20% off on your next purchase. Valid for 30 days. T&C apply.';
            // Reset image
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `
                        <div class="placeholder">
                            <i class="fas fa-image"></i>
                            <span>No image</span>
                        </div>
                    `;
            const icon = document.getElementById('previewImageIcon');
            icon.innerHTML = '<i class="fas fa-gift"></i>';
            icon.style.background = 'var(--primary-container)';
            updatePreview();
            showToast('Form reset to defaults.', 'info');
        }

        function previewFull() {
            showToast('🔍 Opening full preview...', 'info');
            // In a real app, this would open a modal or new view
        }

        // ============================================================
        // TOAST NOTIFICATION
        // ============================================================
        function showToast(message, type) {
            const existing = document.querySelector('.toast-notification');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            const colors = {
                success: '#34A853',
                error: '#EA4335',
                info: '#1A73E8'
            };
            const bg = colors[type] || '#1F1F1F';
            toast.style.cssText = `
                        position: fixed;
                        bottom: 24px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: ${bg};
                        color: #fff;
                        padding: 12px 28px;
                        border-radius: 12px;
                        font-size: 14px;
                        font-weight: 500;
                        font-family: 'Inter', sans-serif;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
                        z-index: 9999;
                        animation: fadeAnim 0.4s ease;
                        max-width: 90%;
                        text-align: center;
                    `;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.4s';
                setTimeout(() => toast.remove(), 500);
            }, 3000);
        }

        // ============================================================
        // INIT
        // ============================================================
        updatePreview();

        // Handle Enter key on inputs
        document.querySelectorAll('input, select, textarea').forEach(el => {
            el.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && this.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                }
            });
        });

        // Auto-close sidebar on resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });

        console.log('🎯 RewardHub Admin Panel loaded.');
        console.log('📦 Modules: Content, Reward, Points, Customer, Product, Design, Media, Settings');
    </script>

</body>
</html>