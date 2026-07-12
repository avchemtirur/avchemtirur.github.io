/* ============================================================
   H4 COUPON — Rewards Catalog View (scaffold)
   Reward creation, stock management and redemption flow will
   be built in the dedicated Rewards build step.
   ============================================================ */
(function(){
  'use strict';

  function render(container){
    const db = CouponDB.data;
    CouponUtils.renderBuildPending(container, {
      icon:'🎁',
      title:'Rewards — pending build',
      desc:'The rewards catalog (name, points cost, stock) and redemption flow will be built here.',
      stats:[ { label:'Rewards Configured', value:db.rewards.length } ]
    });
  }

  window.CouponViews = window.CouponViews || {};
  window.CouponViews.rewards = { render };

})();
