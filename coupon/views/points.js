/* ============================================================
   H4 COUPON — Points System View (scaffold)
   Points earning rules, ledger and expiry logic will be built
   in the dedicated Points System step.
   ============================================================ */
(function(){
  'use strict';

  function render(container){
    const s = CouponDB.data.settings;
    CouponUtils.renderBuildPending(container, {
      icon:'★',
      title:'Points System — pending build',
      desc:`Current rule (from Settings): ${s.pointsPerAmount} point(s) per ₹${s.amountPerPoints} spent, expiring after ${s.pointsExpiryDays} days. The earning/redemption ledger will be built here.`,
      actions:[ { path:'/customers', label:'Go to Customers' } ]
    });
  }

  window.CouponViews = window.CouponViews || {};
  window.CouponViews.points = { render };

})();
