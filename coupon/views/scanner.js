/* ============================================================
   H4 COUPON — QR Coupon Scanner View (scaffold)
   Camera integration + decode logic will be wired in a later
   step. The manual-entry fallback field is already functional
   and routes into the Verify view, since that path is simple
   and needed to exercise the routing layer end-to-end.
   ============================================================ */
(function(){
  'use strict';

  function render(container){
    CouponUtils.renderBuildPending(container, {
      icon:'▣',
      title:'QR Scanner — camera module pending',
      desc:'This screen will host the live camera QR scanner (via a device camera stream + decoder). For now, use manual code entry below to reach the Verify screen.',
      actions:[]
    });

    // Manual fallback entry, appended after the scaffold card.
    const manual = document.createElement('div');
    manual.className = 'card mt-16';
    manual.innerHTML = `
      <div class="card-title">Manual Code Entry</div>
      <div class="field" style="margin-bottom:10px;">
        <label>Coupon Code</label>
        <input id="manualCode" placeholder="e.g. H4C-AB12C" autocapitalize="characters">
      </div>
      <button class="btn btn-filled btn-block" id="manualVerifyBtn">Verify Code</button>
    `;
    container.appendChild(manual);

    document.getElementById('manualVerifyBtn').addEventListener('click', ()=>{
      const code = CouponUtils.qs('#manualCode').value.trim();
      if(!code){ CouponUtils.toast('Enter a coupon code first', 'error'); return; }
      window.location.hash = '/verify?code=' + encodeURIComponent(code);
    });
  }

  window.CouponViews = window.CouponViews || {};
  window.CouponViews.scanner = { render };

})();
