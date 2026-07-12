/* ============================================================
   H4 COUPON — Customer Registration & List View (scaffold)
   Full CRUD (add/edit/search) is intentionally deferred to the
   dedicated Customer Registration build step. This view shows
   the real (currently empty) customer list so the DB layer and
   layout are verifiably wired.
   ============================================================ */
(function(){
  'use strict';

  function render(container){
    const db = CouponDB.data;
    CouponUtils.renderBuildPending(container, {
      icon:'👤',
      title:'Customer Registration — pending build',
      desc:'Add/Edit customer forms, mobile-based lookup and points balance display will be built here next.',
      stats:[ { label:'Total Customers', value:db.customers.length } ],
      actions:[ { path:'/dashboard', label:'Back to Dashboard' } ]
    });

    const listCard = document.createElement('div');
    listCard.className = 'card mt-16';
    listCard.innerHTML = `
      <div class="card-title">Customer List</div>
      ${db.customers.length ? '' : `<div class="empty-state">
        <div class="empty-state__icon">👤</div>
        <div class="empty-state__title">No customers yet</div>
        <div class="small">Registered customers will appear here.</div>
      </div>`}
    `;
    container.appendChild(listCard);
  }

  window.CouponViews = window.CouponViews || {};
  window.CouponViews.customers = { render };

})();
