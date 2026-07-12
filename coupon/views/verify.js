/* ============================================================
   H4 COUPON — Coupon Verification View
   The lookup itself is wired to the real DB layer (simple and
   safe to enable now), but redemption actions (marking used,
   applying discount, awarding points) are intentionally left
   for the dedicated Coupon Verification build step.
   ============================================================ */
(function(){
  'use strict';

  function getCodeFromHash(){
    const hash = window.location.hash || '';
    const qIndex = hash.indexOf('?');
    if(qIndex===-1) return '';
    const params = new URLSearchParams(hash.slice(qIndex+1));
    return params.get('code') || '';
  }

  function lookup(code){
    const db = CouponDB.data;
    const coupon = db.coupons.find(c=>c.code.toLowerCase()===code.toLowerCase());
    CouponDB.data.scanLog.push({
      id:CouponDB.uid(), code, result: coupon ? coupon.status : 'invalid',
      date:new Date().toISOString(), by:(CouponDB.getSession()||{}).name || 'Unknown'
    });
    CouponDB.save();
    return coupon;
  }

  function render(container){
    const code = getCodeFromHash();

    container.innerHTML = `
      <div class="stack">
        <div class="field">
          <label>Coupon Code</label>
          <input id="verifyCode" value="${CouponUtils.esc(code)}" autocapitalize="characters">
        </div>
        <button class="btn btn-filled btn-block" id="verifyBtn">Verify</button>
        <div id="verifyResult"></div>
      </div>
    `;

    function runVerify(){
      const val = CouponUtils.qs('#verifyCode').value.trim();
      const resultEl = CouponUtils.qs('#verifyResult');
      if(!val){ CouponUtils.toast('Enter a coupon code', 'error'); return; }
      const coupon = lookup(val);
      if(!coupon){
        resultEl.innerHTML = `
          <div class="card-outlined mt-16 text-center">
            <div style="font-size:32px;">✕</div>
            <div class="mt-8"><b>Not Found</b></div>
            <div class="small mt-8">No coupon matches this code yet. Coupon issuing isn't built out yet, so the database is currently empty — this lookup is fully wired for when it is.</div>
          </div>`;
        return;
      }
      const chipClass = coupon.status==='active' ? 'chip-success' : coupon.status==='used' ? 'chip-error' : 'chip-primary';
      resultEl.innerHTML = `
        <div class="card mt-16">
          <div class="row-between">
            <div style="font-weight:700;">${CouponUtils.esc(coupon.code)}</div>
            <span class="chip ${chipClass}">${CouponUtils.esc(coupon.status)}</span>
          </div>
          <div class="small mt-8">Type: ${CouponUtils.esc(coupon.type)}</div>
          <div class="small">Value: ${CouponUtils.esc(coupon.value)}</div>
          <div class="small">Created: ${CouponUtils.formatDate(coupon.createdAt)}</div>
          <div class="build-pending mt-16">Redemption actions (mark used, apply discount, award points) will be added in the Coupon Verification build step.</div>
        </div>`;
    }

    CouponUtils.qs('#verifyBtn').addEventListener('click', runVerify);
    if(code) runVerify();
  }

  window.CouponViews = window.CouponViews || {};
  window.CouponViews.verify = { render };

})();
