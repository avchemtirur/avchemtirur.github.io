/* ============================================================
   H4 COUPON — Module 03: Batch Coupon Generator
   Generates N unique coupon codes in one action, sharing a
   type/value/expiry/note, grouped under a batchId so History
   and Reports (later modules) can reference the whole run.

   Uses only the existing CouponDB / CouponUtils layers.
   No external libraries. Offline-first. Mobile-first MD3.
   ============================================================ */
(function(){
  'use strict';

  const MAX_BATCH_SIZE = 500;
  const TYPE_META = {
    discount: { label:'Discount',      placeholder:'e.g. 10% off or ₹100 off' },
    points:   { label:'Points',        placeholder:'e.g. 50' },
    reward:   { label:'Reward Voucher',placeholder:'e.g. Free Tile Adhesive 1kg' }
  };

  /* ---- Code generation with collision avoidance ---- */
  function generateUniqueCode(prefix, existingCodes){
    let code, attempts = 0;
    do{
      code = CouponUtils.generateCode(prefix);
      attempts++;
    } while(existingCodes.has(code) && attempts < 50);
    existingCodes.add(code);
    return code;
  }

  /* ---- Clipboard helper with fallback for older WebViews ---- */
  function copyText(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(
        ()=>CouponUtils.toast('Copied to clipboard'),
        ()=>fallbackCopy(text)
      );
    } else {
      fallbackCopy(text);
    }
  }
  function fallbackCopy(text){
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand('copy'); CouponUtils.toast('Copied to clipboard'); }
    catch(e){ CouponUtils.toast('Copy failed — select and copy manually', 'error'); }
    document.body.removeChild(ta);
  }

  /* ---- CSV export (no external library) ---- */
  function exportBatchCsv(batchId){
    const db = CouponDB.data;
    const rows = db.coupons.filter(c=>c.batchId===batchId);
    if(!rows.length){ CouponUtils.toast('Nothing to export', 'error'); return; }
    const header = ['Code','Type','Value','Status','Created','Expires','Batch Label','Note'];
    const lines = [header.join(',')];
    rows.forEach(c=>{
      const cells = [c.code, c.type, c.value, c.status, c.createdAt, c.expiresAt||'No expiry', c.batchLabel||'', c.note||'']
        .map(v=>`"${String(v).replace(/"/g,'""')}"`);
      lines.push(cells.join(','));
    });
    const blob = new Blob([lines.join('\n')], { type:'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `h4-coupon-batch-${batchId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    CouponUtils.toast('CSV exported');
  }

  /* ---- Group existing coupons into recent batches (real data, no fakes) ---- */
  function getRecentBatches(limit){
    const db = CouponDB.data;
    const map = {};
    db.coupons.forEach(c=>{
      if(!c.batchId) return;
      if(!map[c.batchId]){
        map[c.batchId] = { batchId:c.batchId, label:c.batchLabel||'Untitled Batch', type:c.type, count:0, createdAt:c.createdAt };
      }
      map[c.batchId].count++;
    });
    return Object.values(map)
      .sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit||5);
  }

  /* ---- Results screen (shown right after generation, or when tapping a recent batch) ---- */
  function renderResults(container, batchId){
    const db = CouponDB.data;
    const rows = db.coupons.filter(c=>c.batchId===batchId);
    if(!rows.length){
      CouponUtils.toast('Batch not found', 'error');
      renderForm(container);
      return;
    }
    const first = rows[0];
    const typeLabel = (TYPE_META[first.type] && TYPE_META[first.type].label) || first.type;

    container.innerHTML = `
      <div class="stack">
        <div class="card-outlined text-center">
          <div style="font-size:32px;">✅</div>
          <div class="mt-8" style="font-weight:700;font-size:16px;">${rows.length} Coupons Ready</div>
          <div class="small mt-8">Batch "${CouponUtils.esc(first.batchLabel||'Untitled Batch')}" generated successfully.</div>
        </div>

        <div class="card">
          <div class="card-title">Batch Summary</div>
          <div class="summary-row"><span class="k">Type</span><span class="v">${CouponUtils.esc(typeLabel)}</span></div>
          <div class="summary-row"><span class="k">Value</span><span class="v">${CouponUtils.esc(first.value)}</span></div>
          <div class="summary-row"><span class="k">Quantity</span><span class="v">${rows.length}</span></div>
          <div class="summary-row"><span class="k">Expiry</span><span class="v">${first.expiresAt ? CouponUtils.formatDate(first.expiresAt) : 'No expiry'}</span></div>
          <div class="summary-row"><span class="k">Generated</span><span class="v">${CouponUtils.formatDateTime(first.createdAt)}</span></div>
          <div class="summary-row"><span class="k">Generated By</span><span class="v">${CouponUtils.esc(first.createdBy||'—')}</span></div>
        </div>

        <div class="card">
          <div class="row-between">
            <div class="card-title" style="margin-bottom:0;">Coupon Codes</div>
            <span class="chip chip-primary">${rows.length}</span>
          </div>
          <div class="small mt-8" style="margin-bottom:12px;">Tap any code to copy it individually.</div>
          <div class="code-grid" id="codeGrid">
            ${rows.map(c=>`
              <div class="code-tag" data-code="${CouponUtils.esc(c.code)}">
                <span>${CouponUtils.esc(c.code)}</span>
                <span class="code-tag__copy">⧉</span>
              </div>`).join('')}
          </div>
        </div>

        <div class="stack">
          <button class="btn btn-filled btn-block" id="copyAllBtn">⧉ &nbsp; Copy All Codes</button>
          <button class="btn btn-tonal btn-block" id="exportCsvBtn">⬇ &nbsp; Export CSV</button>
          <button class="btn btn-outlined btn-block" id="newBatchBtn">＋ &nbsp; Generate Another Batch</button>
        </div>
      </div>
    `;

    CouponUtils.qsa('.code-tag', container).forEach(tag=>{
      tag.addEventListener('click', ()=>copyText(tag.getAttribute('data-code')));
    });
    document.getElementById('copyAllBtn').addEventListener('click', ()=>{
      copyText(rows.map(c=>c.code).join('\n'));
    });
    document.getElementById('exportCsvBtn').addEventListener('click', ()=>exportBatchCsv(batchId));
    document.getElementById('newBatchBtn').addEventListener('click', ()=>renderForm(container));
  }

  /* ---- Generation action ---- */
  function generateBatch(container){
    const db = CouponDB.data;
    const s = db.settings;

    const type = CouponUtils.qs('#batchType').value;
    const value = CouponUtils.qs('#batchValue').value.trim();
    const qty = parseInt(CouponUtils.qs('#batchQty').value, 10);
    const prefix = (CouponUtils.qs('#batchPrefix').value.trim() || s.couponPrefix).toUpperCase();
    const expiryEnabled = CouponUtils.qs('#batchExpiryToggle').checked;
    const expiryDays = parseInt(CouponUtils.qs('#batchExpiryDays').value, 10) || 30;
    let label = CouponUtils.qs('#batchLabel').value.trim();
    const note = CouponUtils.qs('#batchNote').value.trim();

    // Validation
    clearFieldErrors(container);
    let hasError = false;
    if(!value){ setFieldError('#batchValue', 'Value / description is required'); hasError = true; }
    if(!qty || qty < 1){ setFieldError('#batchQty', 'Enter a quantity of at least 1'); hasError = true; }
    else if(qty > MAX_BATCH_SIZE){ setFieldError('#batchQty', `Maximum ${MAX_BATCH_SIZE} coupons per batch`); hasError = true; }
    if(!prefix){ setFieldError('#batchPrefix', 'Prefix is required'); hasError = true; }
    if(expiryEnabled && (!expiryDays || expiryDays < 1)){ setFieldError('#batchExpiryDays', 'Enter valid number of days'); hasError = true; }
    if(hasError) return;

    if(!label) label = `Batch ${CouponUtils.formatDate(CouponUtils.todayISO())}`;

    const genBtn = CouponUtils.qs('#generateBtn');
    genBtn.disabled = true;
    genBtn.textContent = 'Generating…';

    // Defer to next tick so the disabled/loading state paints before the
    // (synchronous) generation loop runs — keeps the UI responsive on
    // slower Android devices for larger batches.
    setTimeout(()=>{
      const batchId = CouponDB.uid();
      const nowIso = new Date().toISOString();
      const expiresAt = expiryEnabled ? CouponUtils.addDays(CouponUtils.todayISO(), expiryDays) : null;
      const existingCodes = new Set(db.coupons.map(c=>c.code));
      const session = CouponDB.getSession();

      for(let i=0;i<qty;i++){
        const code = generateUniqueCode(prefix, existingCodes);
        db.coupons.push({
          id: CouponDB.uid(),
          code, type, value, status:'active',
          customerId:null,
          createdAt: nowIso, usedAt:null, expiresAt,
          note, batchId, batchLabel:label,
          createdBy: session ? session.name : 'Unknown'
        });
      }
      s.couponSeq += qty;
      CouponDB.log('Coupon Batch Generated', `${qty} × ${TYPE_META[type].label} coupons — batch "${label}"`);
      CouponDB.save();

      CouponUtils.toast(`${qty} coupons generated`);
      renderResults(container, batchId);
    }, 30);
  }

  function setFieldError(selector, message){
    const input = CouponUtils.qs(selector);
    if(!input) return;
    const field = input.closest('.field');
    field.classList.add('has-error');
    let err = field.querySelector('.error-text');
    if(!err){
      err = document.createElement('div');
      err.className = 'error-text';
      field.appendChild(err);
    }
    err.textContent = message;
  }
  function clearFieldErrors(container){
    CouponUtils.qsa('.field.has-error', container).forEach(f=>{
      f.classList.remove('has-error');
      const err = f.querySelector('.error-text');
      if(err) err.remove();
    });
  }

  /* ---- Form screen ---- */
  function renderForm(container){
    const s = CouponDB.data.settings;
    const recentBatches = getRecentBatches(5);

    container.innerHTML = `
      <div class="stack">
        <div class="card">
          <div class="card-title">Batch Details</div>

          <div class="field">
            <label>Batch Label</label>
            <input id="batchLabel" placeholder="e.g. Diwali 2026 Promo">
            <div class="hint">Optional — helps you find this batch later in History &amp; Reports.</div>
          </div>

          <div class="field">
            <label>Coupon Type</label>
            <select id="batchType">
              ${Object.keys(TYPE_META).map(k=>`<option value="${k}">${TYPE_META[k].label}</option>`).join('')}
            </select>
            <div class="hint">More reward types (Cash, Cash+Points, Jackpot…) arrive with the Reward Engine module.</div>
          </div>

          <div class="field">
            <label>Value / Description</label>
            <input id="batchValue" placeholder="${TYPE_META.discount.placeholder}">
          </div>

          <div class="field">
            <label>Quantity</label>
            <input id="batchQty" type="number" inputmode="numeric" value="10" min="1" max="${MAX_BATCH_SIZE}">
            <div class="hint">Up to ${MAX_BATCH_SIZE} coupons per batch.</div>
          </div>

          <div class="field">
            <label>Coupon Prefix</label>
            <input id="batchPrefix" value="${CouponUtils.esc(s.couponPrefix)}" style="text-transform:uppercase;">
          </div>
        </div>

        <div class="card">
          <div class="card-title">Expiry</div>
          <label class="row" style="cursor:pointer;">
            <input type="checkbox" id="batchExpiryToggle" checked style="width:20px;height:20px;">
            <span>Set an expiry date</span>
          </label>
          <div class="field mt-16" id="expiryDaysField">
            <label>Valid For (days from generation)</label>
            <input id="batchExpiryDays" type="number" inputmode="numeric" value="30" min="1">
          </div>
        </div>

        <div class="card">
          <div class="card-title">Note (applies to every coupon in this batch)</div>
          <div class="field" style="margin-bottom:0;">
            <textarea id="batchNote" rows="2" placeholder="Optional internal note"></textarea>
          </div>
        </div>

        <button class="btn btn-filled btn-block" id="generateBtn">🏷 &nbsp; Generate Coupons</button>

        ${recentBatches.length ? `
        <div class="card">
          <div class="card-title">Recent Batches</div>
          ${recentBatches.map(b=>`
            <button class="list-item" style="width:100%;background:none;border:none;text-align:left;cursor:pointer;" data-batch="${b.batchId}">
              <span class="list-item__avatar">🏷</span>
              <span class="list-item__body">
                <span class="list-item__title">${CouponUtils.esc(b.label)}</span>
                <span class="list-item__subtitle">${b.count} coupons · ${TYPE_META[b.type] ? TYPE_META[b.type].label : b.type} · ${CouponUtils.formatDate(b.createdAt)}</span>
              </span>
            </button>`).join('')}
        </div>` : ''}
      </div>
    `;

    // Type change updates the value placeholder to guide input
    CouponUtils.qs('#batchType').addEventListener('change', (e)=>{
      CouponUtils.qs('#batchValue').placeholder = TYPE_META[e.target.value].placeholder;
    });

    // Expiry toggle show/hide
    const expiryToggle = CouponUtils.qs('#batchExpiryToggle');
    const expiryField = CouponUtils.qs('#expiryDaysField');
    expiryToggle.addEventListener('change', ()=>{
      expiryField.style.display = expiryToggle.checked ? 'block' : 'none';
    });

    CouponUtils.qs('#generateBtn').addEventListener('click', ()=>generateBatch(container));

    CouponUtils.qsa('[data-batch]', container).forEach(btn=>{
      btn.addEventListener('click', ()=>renderResults(container, btn.getAttribute('data-batch')));
    });
  }

  function render(container){
    renderForm(container);
  }

  window.CouponViews = window.CouponViews || {};
  window.CouponViews.batch = { render };

})();
