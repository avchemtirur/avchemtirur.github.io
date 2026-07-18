/* ============================================================
   H4 COUPON — App bootstrap
   Loads after db.js, utils.js, router.js and every view module.
   ============================================================ */
(function(){
  'use strict';

  function applyTheme(){
    const theme = CouponDB.data.settings.theme || 'light';
    document.documentElement.setAttribute('data-theme', theme==='dark' ? 'dark' : 'light');
  }

  function boot(){
    applyTheme();
    if (!window.location.hash) {
  const session = CouponDB.getSession();

  if (session) {
    window.location.hash = '/dashboard';
  } else {
    window.location.hash = '/scanner';
  }
}
    CouponRouter.resolve();
  }

  document.addEventListener('DOMContentLoaded', boot);

  // Expose a tiny app-level API other views/modules can hook into later
  // (e.g. the parent H4 ERP embedding this module, or a future service worker).
  window.CouponApp = {
    reloadTheme: applyTheme,
    refresh: ()=>CouponRouter.resolve()
  };

})();
