/* ============================================================
   H4 COUPON — Dashboard View
   Reads real (currently empty) data from CouponDB so figures
   are always accurate — never fake/placeholder numbers.
   ============================================================ */
(function(){
  'use strict';

  function render(container){
    const db = CouponDB.data;
    const today = CouponUtils.todayISO();

    const totalCustomers = db.customers.length;
    const activeCoupons = db.coupons.filter(c=>c.status==='active').length;
    const scansToday = db.scanLog.filter(s=>s.date && s.date.slice(0,10)===today).length;
    const redemptionsToday = db.redemptions.filter(r=>r.date && r.date.slice(0,10)===today).length;

    const recent = db.activityLog.slice(-6).reverse();

    container.innerHTML = `
      <div class="stack">
        <div class="grid-2">
          <div class="stat-card"><div class="stat-label">Total Customers</div><div class="stat-value">${totalCustomers}</div></div>
          <div class="stat-card"><div class="stat-label">Active Coupons</div><div class="stat-value">${activeCoupons}</div></div>
          <div class="stat-card"><div class="stat-label">Scans Today</div><div class="stat-value">${scansToday}</div></div>
          <div class="stat-card"><div class="stat-label">Redemptions Today</div><div class="stat-value">${redemptionsToday}</div></div>
        </div>

        <div class="card">
          <div class="card-title">Quick Actions</div>
          <div class="stack">
            <button class="btn btn-filled btn-block" data-go="/scanner">▣ &nbsp; Scan Coupon</button>
            <button class="btn btn-tonal btn-block" data-go="/customers">👤 &nbsp; Customers</button>
            <button class="btn btn-tonal btn-block" data-go="/rewards">🎁 &nbsp; Rewards</button>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Recent Activity</div>
          ${recent.length ? recent.map(a=>`
            <div class="list-item">
              <div class="list-item__avatar">•</div>
              <div class="list-item__body">
                <div class="list-item__title">${CouponUtils.esc(a.type)}</div>
                <div class="list-item__subtitle">${CouponUtils.esc(a.message)} · ${CouponUtils.formatDateTime(a.ts)}</div>
              </div>
            </div>`).join('') : `
            <div class="empty-state">
              <div class="empty-state__icon">📋</div>
              <div class="empty-state__title">No activity yet</div>
              <div class="small">Activity will appear here once the coupon &amp; customer modules are built out.</div>
            </div>`}
        </div>
      </div>
    `;

    CouponUtils.qsa('[data-go]', container).forEach(btn=>{
      btn.addEventListener('click', ()=>CouponRouter.navigate(btn.getAttribute('data-go')));
    });
  }

  window.CouponViews = window.CouponViews || {};
  window.CouponViews.dashboard = { render };

})();
