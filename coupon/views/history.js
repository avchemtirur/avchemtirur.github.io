/* ============================================================
   H4 COUPON — Coupon History View (scaffold)
   Full filterable history (by customer, date, status) will be
   built in a later step. Shows the real (empty) scan log now.
   ============================================================ */
(function(){
  'use strict';

  function render(container){
    const db = CouponDB.data;
    CouponUtils.renderBuildPending(container, {
      icon:'🕘',
      title:'Coupon History — pending build',
      desc:'Filterable history of issued, scanned and redeemed coupons will be built here.',
      stats:[
        { label:'Coupons Issued', value:db.coupons.length },
        { label:'Scans Logged', value:db.scanLog.length }
      ]
    });
  }

  window.CouponViews = window.CouponViews || {};
  window.CouponViews.history = { render };

})();
