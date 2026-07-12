/* ============================================================
   H4 COUPON — Settings View (scaffold)
   Editable settings form will be built in a later step.
   Displays real current values (read-only) so the DB layer is
   visibly wired.
   ============================================================ */
(function(){
  'use strict';

  function render(container){
    const s = CouponDB.data.settings;
    CouponUtils.renderBuildPending(container, {
      icon:'⚙',
      title:'Settings — pending build',
      desc:'Editable business details, points rules, coupon numbering and theme will be built here.'
    });

    const card = document.createElement('div');
    card.className = 'card mt-16';
    card.innerHTML = `
      <div class="card-title">Current Values (read-only)</div>
      <div class="list-item"><div class="list-item__body"><div class="list-item__title">Business Name</div><div class="list-item__subtitle">${CouponUtils.esc(s.businessName)}</div></div></div>
      <div class="list-item"><div class="list-item__body"><div class="list-item__title">Coupon Prefix</div><div class="list-item__subtitle">${CouponUtils.esc(s.couponPrefix)}</div></div></div>
      <div class="list-item"><div class="list-item__body"><div class="list-item__title">Points Rule</div><div class="list-item__subtitle">${s.pointsPerAmount} pt / ₹${s.amountPerPoints}</div></div></div>
      <div class="list-item"><div class="list-item__body"><div class="list-item__title">Points Expiry</div><div class="list-item__subtitle">${s.pointsExpiryDays} days</div></div></div>
    `;
    container.appendChild(card);
  }

  window.CouponViews = window.CouponViews || {};
  window.CouponViews.settings = { render };

})();
