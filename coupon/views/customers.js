/* ============================================================
   H4 COUPON — Module 05: Customer Registration & Management
   Replaces the earlier scaffold. Fully self-contained: uses
   only the existing CouponDB / CouponUtils layers plus the
   ripple/mobile-validation helpers added to utils.js for reuse
   by later modules.

   Public API (for future modules — Scanner, Verify, Reward
   Engine — to hook into without touching this file again):
     window.CouponCustomers.findByMobile(mobile)
     window.CouponCustomers.findById(id)
     window.CouponCustomers.addHistoryEntry(customerId, entry)
     window.CouponCustomers.recalcStats(customer)
   ============================================================ */
(function(){
  'use strict';

  let ROOT = null;
  let STATE = { mode:'list', editingId:null, viewingId:null, searchQuery:'' };
  let mobileCheckTimer = null;

  /* =========================================================
     DATA HELPERS — customer schema:
     { id, name, mobile, address, joinedAt, status,
       totalCoupons, totalPoints, totalCashRewards, totalGifts,
       lastScanDate, history:[] }
     ========================================================= */

  function findByMobile(mobile, excludeId){
    const clean = CouponUtils.cleanMobile(mobile);
    return CouponDB.data.customers.find(c=> c.mobile===clean && c.id!==excludeId);
  }
  function findById(id){
    return CouponDB.data.customers.find(c=>c.id===id);
  }

  function recalcStats(customer){
    const h = customer.history || [];
    customer.totalCoupons = h.length;
    customer.totalPoints = h.reduce((sum,e)=> sum + (Number(e.points)||0), 0);
    customer.totalCashRewards = h.reduce((sum,e)=> sum + (Number(e.cash)||0), 0);
    customer.totalGifts = h.filter(e=> e.gift && String(e.gift).trim()).length;
    customer.lastScanDate = h.length ? h.map(e=>e.scanDate).sort().slice(-1)[0] : customer.lastScanDate || null;
  }

  // Public hook for future modules (Scanner / Verify / Reward Engine)
  function addHistoryEntry(customerId, entry){
    const customer = findById(customerId);
    if(!customer) return null;
    customer.history = customer.history || [];
    customer.history.push(Object.assign({ id:CouponDB.uid(), scanDate:new Date().toISOString() }, entry));
    recalcStats(customer);
    CouponDB.save();
    return customer;
  }

  function createCustomer(data){
    const now = new Date().toISOString();
    const customer = {
      id: CouponDB.uid(),
      name: data.name,
      mobile: data.mobile,
      address: data.address || '',
      joinedAt: now,
      status: 'Active',
      totalCoupons: 0, totalPoints: 0, totalCashRewards: 0, totalGifts: 0,
      lastScanDate: null,
      history: []
    };
    CouponDB.data.customers.push(customer);
    CouponDB.log('Customer Registered', `${customer.name} (${customer.mobile})`);
    CouponDB.save();
    return customer;
  }

  function updateCustomer(id, data){
    const customer = findById(id);
    if(!customer) return null;
    customer.name = data.name;
    customer.mobile = data.mobile;
    customer.address = data.address || '';
    CouponDB.log('Customer Updated', `${customer.name} (${customer.mobile})`);
    CouponDB.save();
    return customer;
  }

  function deleteCustomer(id){
    const customer = findById(id);
    if(!customer) return;
    CouponDB.data.customers = CouponDB.data.customers.filter(c=>c.id!==id);
    CouponDB.log('Customer Deleted', `${customer.name} (${customer.mobile})`);
    CouponDB.save();
  }

  function toggleStatus(id){
    const customer = findById(id);
    if(!customer) return;
    customer.status = customer.status==='Active' ? 'Inactive' : 'Active';
    CouponDB.log('Customer Status Changed', `${customer.name} → ${customer.status}`);
    CouponDB.save();
  }

  /* =========================================================
     LIST VIEW
     ========================================================= */
  function renderList(){
    const db = CouponDB.data;
    const q = STATE.searchQuery.trim().toLowerCase();
    const list = db.customers
      .filter(c=> !q || c.name.toLowerCase().includes(q) || c.mobile.includes(q))
      .sort((a,b)=> new Date(b.joinedAt) - new Date(a.joinedAt));

    ROOT.innerHTML = `
      <div class="stack">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input id="custSearch" placeholder="Search by name or mobile number" value="${CouponUtils.esc(STATE.searchQuery)}" inputmode="search">
          ${STATE.searchQuery ? `<span class="clear-icon" id="clearSearch">✕</span>` : ''}
        </div>

        <div class="stat-card">
          <div class="stat-label">Total Customers</div>
          <div class="stat-value">${db.customers.length}</div>
        </div>

        <div class="card" style="padding:6px 12px;">
          ${list.length ? list.map(c=>customerRow(c)).join('') : `
          <div class="empty-state">
            <div class="empty-state__icon">👤</div>
            <div class="empty-state__title">${q ? 'No matching customers' : 'No customers yet'}</div>
            <div class="small">${q ? 'Try a different name or mobile number.' : 'Tap + to register your first customer.'}</div>
          </div>`}
        </div>
      </div>
      <button class="fab" id="addCustomerFab" title="Add Customer">＋</button>
    `;

    CouponUtils.qs('#custSearch').addEventListener('input', (e)=>{
      STATE.searchQuery = e.target.value;
      renderList();
      const input = CouponUtils.qs('#custSearch');
      input.focus();
      input.selectionStart = input.selectionEnd = input.value.length;
    });
    const clearBtn = CouponUtils.qs('#clearSearch');
    if(clearBtn) clearBtn.addEventListener('click', ()=>{ STATE.searchQuery=''; renderList(); });

    CouponUtils.qs('#addCustomerFab').addEventListener('click', ()=>{
      STATE.mode='form'; STATE.editingId=null; renderForm();
    });

    CouponUtils.qsa('.cust-row-body', ROOT).forEach(el=>{
      el.addEventListener('click', ()=>{ STATE.mode='profile'; STATE.viewingId = Number(el.getAttribute('data-id')); renderProfile(); });
    });
    CouponUtils.qsa('.cust-row-menu', ROOT).forEach(el=>{
      el.addEventListener('click', (e)=>{ e.stopPropagation(); openRowActions(Number(el.getAttribute('data-id'))); });
    });

    CouponUtils.attachRippleAll('.list-item, .fab, .btn', ROOT);
  }

  function initials(name){
    return (name||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  }

  function customerRow(c){
    const statusClass = c.status==='Active' ? 'active' : 'inactive';
    return `
      <div class="list-item" style="cursor:pointer;">
        <div class="cust-row-body row" data-id="${c.id}" style="flex:1;min-width:0;">
          <div class="avatar-initials">${CouponUtils.esc(initials(c.name))}</div>
          <div class="list-item__body">
            <div class="list-item__title">${CouponUtils.esc(c.name)}</div>
            <div class="list-item__subtitle">${CouponUtils.esc(c.mobile)}</div>
          </div>
        </div>
        <div class="row" style="gap:8px;">
          <span class="status-pill ${statusClass}"><span class="dot"></span>${c.status}</span>
          <button class="btn-icon cust-row-menu" data-id="${c.id}" title="More">⋮</button>
        </div>
      </div>
    `;
  }

  function openRowActions(id){
    const customer = findById(id);
    if(!customer) return;
    CouponUtils.openModal(`
      <div class="modal-sheet__title">${CouponUtils.esc(customer.name)}</div>
      <div class="stack" style="gap:0;">
        <button class="action-sheet-item" data-act="profile"><span class="action-sheet-item__icon">👤</span> View Profile</button>
        <button class="action-sheet-item" data-act="edit"><span class="action-sheet-item__icon">✎</span> Edit Customer</button>
        <button class="action-sheet-item" data-act="status"><span class="action-sheet-item__icon">⇄</span> Mark as ${customer.status==='Active'?'Inactive':'Active'}</button>
        <button class="action-sheet-item danger" data-act="delete"><span class="action-sheet-item__icon">🗑</span> Delete Customer</button>
      </div>
    `);
    CouponUtils.qsa('[data-act]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const act = btn.getAttribute('data-act');
        CouponUtils.closeModal();
        if(act==='profile'){ STATE.mode='profile'; STATE.viewingId=customer.id; renderProfile(); }
        else if(act==='edit'){ STATE.mode='form'; STATE.editingId=customer.id; renderForm(); }
        else if(act==='status'){ toggleStatus(customer.id); CouponUtils.toast(`${customer.name} marked ${customer.status}`); renderList(); }
        else if(act==='delete'){ confirmDelete(customer.id); }
      });
    });
  }

  function confirmDelete(id){
    const customer = findById(id);
    if(!customer) return;
    CouponUtils.openModal(`
      <div class="modal-sheet__title">Delete Customer?</div>
      <div class="small">This will permanently remove <b>${CouponUtils.esc(customer.name)}</b> (${CouponUtils.esc(customer.mobile)}) and their history. This cannot be undone.</div>
      <div class="modal-sheet__actions">
        <button class="btn btn-text" id="cancelDelete">Cancel</button>
        <button class="btn btn-danger" id="confirmDelete">Delete</button>
      </div>
    `);
    CouponUtils.qs('#cancelDelete').addEventListener('click', CouponUtils.closeModal);
    CouponUtils.qs('#confirmDelete').addEventListener('click', ()=>{
      deleteCustomer(id);
      CouponUtils.closeModal();
      CouponUtils.toast('Customer deleted');
      STATE.mode='list';
      renderList();
    });
  }

  /* =========================================================
     REGISTRATION / EDIT FORM
     ========================================================= */
  function renderForm(){
    const isEdit = !!STATE.editingId;
    const customer = isEdit ? findById(STATE.editingId) : null;

    ROOT.innerHTML = `
      <div class="stack">
        <button class="btn btn-text" id="backBtn" style="align-self:flex-start;padding-left:0;">← Back</button>

        <div class="card">
          <div class="card-title">${isEdit ? 'Edit Customer' : 'Customer Registration'}</div>

          <div class="field" id="nameField">
            <label>Customer Name *</label>
            <input id="custName" placeholder="Full name" value="${customer ? CouponUtils.esc(customer.name) : ''}">
          </div>

          <div class="field" id="mobileField">
            <label>Mobile Number *</label>
            <input id="custMobile" placeholder="10-digit mobile number" inputmode="numeric" maxlength="10"
              value="${customer ? CouponUtils.esc(customer.mobile) : ''}">
            <div id="mobileStatus"></div>
          </div>

          <div class="field" style="margin-bottom:0;">
            <label>Address (optional)</label>
            <textarea id="custAddress" rows="2" placeholder="Address">${customer ? CouponUtils.esc(customer.address) : ''}</textarea>
          </div>
        </div>

        <div class="stack">
          <button class="btn btn-filled btn-block" id="saveBtn">${isEdit ? 'UPDATE CUSTOMER' : 'SAVE CUSTOMER'}</button>
          ${isEdit ? `<button class="btn btn-danger btn-block" id="deleteBtn">DELETE CUSTOMER</button>` : ''}
          <button class="btn btn-outlined btn-block" id="clearBtn">CLEAR</button>
        </div>
      </div>
    `;

    CouponUtils.qs('#backBtn').addEventListener('click', ()=>{ STATE.mode='list'; renderList(); });
    CouponUtils.qs('#clearBtn').addEventListener('click', ()=>{
      CouponUtils.qs('#custName').value = '';
      CouponUtils.qs('#custMobile').value = '';
      CouponUtils.qs('#custAddress').value = '';
      CouponUtils.qs('#mobileStatus').innerHTML = '';
      clearFieldError('nameField'); clearFieldError('mobileField');
    });

    CouponUtils.qs('#custMobile').addEventListener('input', (e)=>{
      e.target.value = e.target.value.replace(/\D/g,'').slice(0,10);
      clearTimeout(mobileCheckTimer);
      mobileCheckTimer = setTimeout(checkMobileDuplicate, 300);
    });

    if(isEdit){
      CouponUtils.qs('#deleteBtn').addEventListener('click', ()=>confirmDelete(customer.id));
    }
    CouponUtils.qs('#saveBtn').addEventListener('click', ()=>submitForm(isEdit, customer));

    CouponUtils.attachRippleAll('.btn', ROOT);
  }

  function checkMobileDuplicate(){
    const mobileInput = CouponUtils.qs('#custMobile');
    const statusEl = CouponUtils.qs('#mobileStatus');
    if(!mobileInput || !statusEl) return;
    const mobile = mobileInput.value;
    statusEl.innerHTML = '';
    if(mobile.length!==10) return;

    const existing = findByMobile(mobile, STATE.editingId);
    if(existing){
      statusEl.innerHTML = `
        <div class="error-text">Customer already exists.</div>
        <button class="btn btn-tonal btn-sm mt-8" id="viewExistingBtn" type="button">View ${CouponUtils.esc(existing.name)}'s Profile</button>
      `;
      CouponUtils.qs('#viewExistingBtn').addEventListener('click', ()=>{
        STATE.mode='profile'; STATE.viewingId = existing.id; renderProfile();
      });
      CouponUtils.toast('Customer already exists.', 'error');
    }
  }

  function setFieldError(fieldId, message){
    const field = document.getElementById(fieldId);
    field.classList.add('has-error');
    let err = field.querySelector('.error-text');
    if(!err){ err = document.createElement('div'); err.className='error-text'; field.appendChild(err); }
    err.textContent = message;
  }
  function clearFieldError(fieldId){
    const field = document.getElementById(fieldId);
    if(!field) return;
    field.classList.remove('has-error');
    const err = field.querySelector('.error-text');
    if(err) err.remove();
  }

  function submitForm(isEdit, existingCustomer){
    clearFieldError('nameField'); clearFieldError('mobileField');

    const name = CouponUtils.qs('#custName').value.trim();
    const mobile = CouponUtils.cleanMobile(CouponUtils.qs('#custMobile').value);
    const address = CouponUtils.qs('#custAddress').value.trim();

    let hasError = false;
    if(!name){ setFieldError('nameField', 'Customer name is required.'); CouponUtils.toast('Customer name is required.', 'error'); hasError = true; }
    if(!mobile){ setFieldError('mobileField', 'Mobile number is required.'); CouponUtils.toast('Mobile number is required.', 'error'); hasError = true; }
    else if(!CouponUtils.isValidMobile(mobile)){ setFieldError('mobileField', 'Enter a valid 10-digit mobile number.'); CouponUtils.toast('Enter a valid 10-digit mobile number.', 'error'); hasError = true; }

    if(!hasError){
      const dup = findByMobile(mobile, isEdit ? existingCustomer.id : null);
      if(dup){
        setFieldError('mobileField', 'Customer already exists.');
        CouponUtils.toast('Customer already exists.', 'error');
        hasError = true;
      }
    }
    if(hasError) return;

    const data = { name, mobile, address };
    if(isEdit){
      updateCustomer(existingCustomer.id, data);
      CouponUtils.toast('Customer updated');
      STATE.mode='profile'; STATE.viewingId = existingCustomer.id; renderProfile();
    } else {
      const customer = createCustomer(data);
      CouponUtils.toast('Customer saved');
      STATE.mode='profile'; STATE.viewingId = customer.id; renderProfile();
    }
  }

  /* =========================================================
     PROFILE VIEW (identity + dashboard cards + history)
     ========================================================= */
  function renderProfile(){
    const customer = findById(STATE.viewingId);
    if(!customer){ STATE.mode='list'; renderList(); return; }
    recalcStats(customer);

    const history = (customer.history||[]).slice().sort((a,b)=> new Date(b.scanDate) - new Date(a.scanDate));

    ROOT.innerHTML = `
      <div class="stack">
        <button class="btn btn-text" id="backBtn" style="align-self:flex-start;padding-left:0;">← Back</button>

        <div class="card">
          <div class="row" style="align-items:flex-start;">
            <div class="avatar-initials" style="width:56px;height:56px;font-size:19px;">${CouponUtils.esc(initials(customer.name))}</div>
            <div style="flex:1;">
              <div style="font-size:17px;font-weight:700;">${CouponUtils.esc(customer.name)}</div>
              <div class="small">${CouponUtils.esc(customer.mobile)}</div>
              ${customer.address ? `<div class="small">${CouponUtils.esc(customer.address)}</div>` : ''}
            </div>
          </div>
          <hr class="divider">
          <div class="summary-row"><span class="k">Member Since</span><span class="v">${CouponUtils.formatDate(customer.joinedAt)}</span></div>
          <div class="summary-row"><span class="k">Status</span><span class="v">
            <span class="status-pill ${customer.status==='Active'?'active':'inactive'}"><span class="dot"></span>${customer.status}</span>
          </span></div>
        </div>

        <div class="grid-2">
          <div class="stat-card"><div class="stat-label">Total Coupons</div><div class="stat-value">${customer.totalCoupons}</div></div>
          <div class="stat-card"><div class="stat-label">Total Points</div><div class="stat-value">${customer.totalPoints}</div></div>
          <div class="stat-card"><div class="stat-label">Total Cash Rewards</div><div class="stat-value">₹${customer.totalCashRewards}</div></div>
          <div class="stat-card"><div class="stat-label">Total Gifts</div><div class="stat-value">${customer.totalGifts}</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Last Scan Date</div>
          <div class="stat-value" style="font-size:16px;">${customer.lastScanDate ? CouponUtils.formatDateTime(customer.lastScanDate) : '—'}</div>
        </div>

        <div class="row" style="gap:10px;">
          <button class="btn btn-tonal" style="flex:1;" id="editBtn">✎ Edit</button>
          <button class="btn btn-tonal" style="flex:1;" id="statusBtn">⇄ ${customer.status==='Active'?'Deactivate':'Activate'}</button>
          <button class="btn btn-danger" style="flex:1;" id="deleteBtn2">🗑 Delete</button>
        </div>

        <div class="card">
          <div class="row-between">
            <div class="card-title" style="margin-bottom:0;">Customer History</div>
            <span class="chip chip-primary">${history.length}</span>
          </div>
          <div class="mt-16">
            ${history.length ? history.map(h=>historyRow(h)).join('') : `
            <div class="empty-state">
              <div class="empty-state__icon">🕘</div>
              <div class="empty-state__title">No history yet</div>
              <div class="small">Coupon scans and rewards will appear here once the Scanner &amp; Reward Engine modules are built.</div>
            </div>`}
          </div>
        </div>
      </div>
    `;

    CouponUtils.qs('#backBtn').addEventListener('click', ()=>{ STATE.mode='list'; renderList(); });
    CouponUtils.qs('#editBtn').addEventListener('click', ()=>{ STATE.mode='form'; STATE.editingId=customer.id; renderForm(); });
    CouponUtils.qs('#statusBtn').addEventListener('click', ()=>{
      toggleStatus(customer.id);
      CouponUtils.toast(`Marked ${customer.status}`);
      renderProfile();
    });
    CouponUtils.qs('#deleteBtn2').addEventListener('click', ()=>confirmDelete(customer.id));

    CouponUtils.attachRippleAll('.btn', ROOT);
  }

  function historyRow(h){
    const statusClass = (h.status==='Used' || h.status==='Expired') ? 'chip-error' : 'chip-success';
    return `
      <div class="list-item">
        <div class="list-item__body">
          <div class="list-item__title">${CouponUtils.esc(h.couponCode||'—')} <span class="chip ${statusClass}" style="margin-left:6px;">${CouponUtils.esc(h.status||'—')}</span></div>
          <div class="list-item__subtitle">
            ${CouponUtils.esc(h.rewardType||'—')}
            ${h.points ? ` · ${h.points} pts` : ''}
            ${h.cash ? ` · ₹${h.cash}` : ''}
            ${h.gift ? ` · ${CouponUtils.esc(h.gift)}` : ''}
            &nbsp;·&nbsp; ${CouponUtils.formatDateTime(h.scanDate)}
          </div>
        </div>
      </div>
    `;
  }

  /* =========================================================
     ENTRY POINT (called by router on every visit to /customers)
     ========================================================= */
  function render(container){
    ROOT = container;
    STATE = { mode:'list', editingId:null, viewingId:null, searchQuery:'' };
    renderList();
  }

  window.CouponViews = window.CouponViews || {};
  window.CouponViews.customers = { render };

  // Public API for future modules to integrate with customer records.
  window.CouponCustomers = { findByMobile, findById, addHistoryEntry, recalcStats };

})();
