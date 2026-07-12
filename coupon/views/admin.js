/* ============================================================
   H4 COUPON — Admin Panel View (scaffold, Admin role only)
   User management, data export/import and factory reset will
   be built in a later step. Router already enforces adminOnly.
   ============================================================ */
(function(){
  'use strict';

  function render(container){
    const db = CouponDB.data;
    CouponUtils.renderBuildPending(container, {
      icon:'🛡',
      title:'Admin Panel — pending build',
      desc:'Staff user management, JSON export/import and data reset tools will be built here.',
      stats:[ { label:'Staff Users', value:db.users.length } ]
    });
  }

  window.CouponViews = window.CouponViews || {};
  window.CouponViews.admin = { render };

})();
