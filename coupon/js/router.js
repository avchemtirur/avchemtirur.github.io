/* ============================================================
   H4 COUPON — Hash-based Router
   Namespace: CouponRouter
   Each view module (js/views/*.js) registers itself into
   window.CouponViews before this file runs its bootstrap.
   ============================================================ */
(function(window){
  'use strict';

  // Route table: path -> config
  // view       -> key into window.CouponViews
  // protected  -> requires an active session
  // navKey     -> matches a .bottomnav__item[data-nav] for active state
  // title      -> topbar title
  // adminOnly  -> only role === 'Admin' may access
  const ROUTES = {
    '/login':      { view:'login',      protected:false, navKey:null,        title:'H4 Coupon',        chrome:false },'/register': {
  view: 'register',
  protected: false,
  navKey: null,
  title: 'Customer Registration',
  chrome: false
},
    '/dashboard':  { view:'dashboard',  protected:true,  navKey:'dashboard', title:'Dashboard',         chrome:true  },
    '/scanner':    { view:'scanner',    protected:false, navKey:'scanner',   title:'Scan Coupon',       chrome:true  },
},
    '/verify':     { view:'verify',     protected:false, navKey:null,        title:'Verify Coupon',     chrome:true  },
    '/customers':  { view:'customers',  protected:true,  navKey:'customers', title:'Customers',         chrome:true  },
    '/points':     { view:'points',     protected:true,  navKey:null,        title:'Points',            chrome:true  },
    '/rewards':    { view:'rewards',    protected:true,  navKey:'rewards',   title:'Rewards',           chrome:true  },
    '/history':    { view:'history',    protected:true,  navKey:null,        title:'Coupon History',    chrome:true  },
    '/settings':   { view:'settings',   protected:true,  navKey:null,        title:'Settings',          chrome:true  },
    '/admin':      { view:'admin',      protected:true,  navKey:null,        title:'Admin Panel',       chrome:true, adminOnly:true }
  };

  const DEFAULT_ROUTE = '/dashboard';
  const LOGIN_ROUTE = '/login';

  // Primary destinations shown directly in the bottom nav.
  // Anything else is reachable via the "More" sheet.
  const NAV_ITEMS = [
    { path:'/dashboard', navKey:'dashboard', icon:'⌂', label:'Home' },
    { path:'/scanner',   navKey:'scanner',   icon:'▣', label:'Scan' },
    { path:'/customers', navKey:'customers', icon:'👤', label:'Customers' },
    { path:'/rewards',   navKey:'rewards',   icon:'🎁', label:'Rewards' },
    { path:'__more__',   navKey:'more',      icon:'⋯', label:'More' }
  ];
  const MORE_ITEMS = [
    { path:'/points',   icon:'★', label:'Points Ledger' },
    { path:'/history',  icon:'🕘', label:'Coupon History' },
    { path:'/settings', icon:'⚙', label:'Settings' },
    { path:'/admin',    icon:'🛡', label:'Admin Panel', adminOnly:true }
  ];

  function currentPath(){
    const hash = window.location.hash || '';
    const path = hash.replace(/^#/, '') || DEFAULT_ROUTE;
    return path.split('?')[0];
  }

  function navigate(path){
    window.location.hash = path;
  }

  function renderShell(route){
    const app = document.getElementById('app');
    const session = CouponDB.getSession();

    if(!route.chrome){
      app.innerHTML = `<div id="view" class="no-bottom-pad"></div>`;
      return document.getElementById('view');
    }

    app.innerHTML = `
      <header class="topbar">
        <div class="topbar__title">${route.title}</div>
        ${session ? `<button class="topbar__icon-btn" id="logoutBtn" title="Logout">⏻</button>` : ''}
      </header>
      <main id="view"></main>
      <nav class="bottomnav" id="bottomnav"></nav>
    `;
    renderBottomNav(route.navKey);
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) logoutBtn.addEventListener('click', doLogout);
    return document.getElementById('view');
  }

  function renderBottomNav(activeKey){
    const nav = document.getElementById('bottomnav');
    if(!nav) return;
    nav.innerHTML = NAV_ITEMS.map(item=>`
      <button class="bottomnav__item ${item.navKey===activeKey?'active':''}" data-nav="${item.navKey}" data-path="${item.path}">
        <span class="bottomnav__icon">${item.icon}</span>
        <span class="bottomnav__label">${item.label}</span>
      </button>
    `).join('');
    CouponUtils.qsa('.bottomnav__item', nav).forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const path = btn.getAttribute('data-path');
        if(path==='__more__') openMoreSheet();
        else navigate(path);
      });
    });
  }

  function openMoreSheet(){
    const session = CouponDB.getSession();
    const items = MORE_ITEMS.filter(i=> !i.adminOnly || (session && session.role==='Admin'));
    CouponUtils.openModal(`
      <div class="modal-sheet__title">More</div>
      <div class="stack">
        ${items.map(i=>`
          <button class="list-item" style="width:100%;background:none;border:none;text-align:left;cursor:pointer;" data-path="${i.path}">
            <span class="list-item__avatar">${i.icon}</span>
            <span class="list-item__body"><span class="list-item__title">${i.label}</span></span>
          </button>`).join('')}
        <button class="list-item" style="width:100%;background:none;border:none;text-align:left;cursor:pointer;" id="moreLogout">
          <span class="list-item__avatar">⏻</span>
          <span class="list-item__body"><span class="list-item__title">Logout</span></span>
        </button>
      </div>
    `);
    CouponUtils.qsa('[data-path]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const path = btn.getAttribute('data-path');
        CouponUtils.closeModal();
        navigate(path);
      });
    });
    const logoutBtn = document.getElementById('moreLogout');
    if(logoutBtn) logoutBtn.addEventListener('click', ()=>{ CouponUtils.closeModal(); doLogout(); });
  }

  function doLogout(){
    CouponDB.log('Logout', (CouponDB.getSession()||{}).name + ' logged out');
    CouponDB.save();
    CouponDB.clearSession();
    navigate(LOGIN_ROUTE);
  }

  function resolve(){
    const path = currentPath();
    const route = ROUTES[path] || ROUTES[DEFAULT_ROUTE];
    const session = CouponDB.getSession();

    if(route.protected && !session){
      navigate(LOGIN_ROUTE);
      return;
    }
    if(!route.protected && session && path===LOGIN_ROUTE){
      navigate(DEFAULT_ROUTE);
      return;
    }
    if(route.adminOnly && session && session.role!=='Admin'){
      CouponUtils.toast('Admin access only', 'error');
      navigate(DEFAULT_ROUTE);
      return;
    }

    const container = renderShell(route);
    const view = window.CouponViews && window.CouponViews[route.view];
    if(view && typeof view.render==='function'){
      view.render(container);
    } else {
      container.innerHTML = `<div class="empty-state">
        <div class="empty-state__icon">🚧</div>
        <div class="empty-state__title">View not registered</div>
        <div class="small">js/views/${route.view}.js is missing render().</div>
      </div>`;
    }
  }

  window.CouponRouter = { navigate, resolve, ROUTES, NAV_ITEMS };

  window.addEventListener('hashchange', resolve);

})(window);
