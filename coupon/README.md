H4 Coupon Module
Standalone, offline-first coupon / loyalty system for H4 Construction Solutions.
Lives in /coupon/ as its own module — independent from the H4 ERP today, built
so it can be linked to it later (e.g. shared customer records) without a rewrite.
Status
Architecture, routing, navigation and shared components are complete and working.
Business logic for each feature module is intentionally not built yet — each
view is a scaffold that renders real (currently empty) data from the database
layer, with a "pending build" notice. Login and Dashboard are fully functional
since they're infrastructure, not feature modules.
Build order will be driven by explicit instruction, one module at a time:
Scanner → Verify → Customers → Points → Rewards → History → Settings → Admin.
Folder structure
coupon/
├── index.html              Entry point — loads CSS/JS in the required order
├── css/
│   ├── tokens.css          Material 3 design tokens (colors, shape, elevation, type)
│   ├── base.css            Resets, app shell, top bar, bottom nav, layout utilities
│   └── components.css      Reusable components: buttons, cards, fields, chips,
│                            list items, snackbar, modal sheet, segmented control
├── js/
│   ├── db.js                CouponDB — localStorage data layer
│   ├── utils.js              CouponUtils — shared helpers (toast, modal, formatting)
│   ├── router.js             CouponRouter — hash router, auth guard, bottom nav
│   ├── app.js                Boot sequence (runs last)
│   └── views/
│       ├── login.js          ✅ functional
│       ├── dashboard.js      ✅ functional (live stats from DB)
│       ├── scanner.js        🧩 scaffold + working manual-code fallback
│       ├── verify.js         🧩 scaffold + working coupon lookup
│       ├── customers.js      🧩 scaffold
│       ├── points.js         🧩 scaffold
│       ├── rewards.js        🧩 scaffold
│       ├── history.js        🧩 scaffold
│       ├── settings.js       🧩 scaffold (read-only current values)
│       └── admin.js          🧩 scaffold (Admin role only)
└── assets/                  Reserved for icons/images (empty for now)
Conventions
No build step. Plain <script> tags (not ES modules) so the app opens
directly from a filesystem or any static host, including file:// on Android,
without CORS/module-loading issues.
Global namespaces, not ES modules: CouponDB, CouponUtils, CouponRouter,
CouponApp, and CouponViews.<name> for each view. Every file attaches to
window inside an IIFE — no globals leak besides these intentional ones.
Storage key: h4_coupon_db_v1 in localStorage, session in
sessionStorage under h4_coupon_session_v1. Fully separate from the H4 ERP's
own storage keys — the two can run in the same browser without collisions.
Data layer pattern: CouponDB.data is the live in-memory object;
call CouponDB.save() after every mutation. CouponDB.load() deep-fills
missing fields against defaultData() so future schema additions won't break
existing saved data (same pattern as the parent ERP).
Routing: hash-based (#/dashboard, #/scanner, etc.), defined in the
ROUTES table in router.js. Each route declares whether it's protected
(needs login), adminOnly, and which bottom-nav key it highlights. Adding a
new screen = add a route + a js/views/<name>.js file that registers
CouponViews.<name> = { render(container) {...} }.
Bottom navigation: 4 primary destinations + a "More" bottom sheet for the
rest, per Material 3 guidance (avoid overcrowding the nav bar). Edit
NAV_ITEMS / MORE_ITEMS in router.js to change what's surfaced.
Scaffold helper: CouponUtils.renderBuildPending(container, opts) gives
every unbuilt view a consistent, on-brand "pending" card instead of a blank
screen — pass stats to show live counts pulled from the DB.
Mobile-first: single column capped at --md-max-width (520px), 44px+
touch targets throughout, 16px input font-size to prevent iOS/Android auto-zoom,
bottom nav + FAB positioned for one-hand thumb reach.
Next steps (wait for instruction before each)
QR Scanner — camera stream + decode library, write results into scanLog.
Coupon Verification — redemption actions (mark used, apply discount/points).
Customer Registration — add/edit form, mobile-number lookup, points display.
Points System — earning rules engine, ledger view, expiry handling.
Rewards — catalog CRUD, stock tracking, redemption against customer points.
Coupon History — filterable table (customer, date range, status).
Settings — editable form for everything currently shown read-only.
Admin Panel — staff user management, JSON export/import, factory reset.