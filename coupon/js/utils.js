/* ============================================================
   H4 COUPON — Shared utility helpers
   Namespace: CouponUtils
   ============================================================ */
(function(window){
  'use strict';

  function esc(str){
    return (str==null?'':String(str)).replace(/[&<>"']/g, m=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  function todayISO(){
    return new Date().toISOString().slice(0,10);
  }

  function formatDate(iso){
    if(!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  }

  function formatDateTime(iso){
    if(!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }

  function addDays(iso, days){
    const d = new Date(iso);
    d.setDate(d.getDate()+Number(days));
    return d.toISOString().slice(0,10);
  }

  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }

  /* ---- Snackbar (Material 3 toast) ---- */
  function toast(message, type){
    let host = qs('#snackbar-host');
    if(!host){
      host = document.createElement('div');
      host.id = 'snackbar-host';
      document.body.appendChild(host);
    }
    const el = document.createElement('div');
    el.className = 'snackbar';
    if(type==='error') el.style.background = 'var(--md-error)';
    if(type==='error') el.style.color = 'var(--md-on-error)';
    el.textContent = message;
    host.appendChild(el);
    setTimeout(()=>{ el.remove(); }, 2600);
  }

  /* ---- Modal / bottom sheet ---- */
  function openModal(innerHtml, opts){
    closeModal();
    const scrim = document.createElement('div');
    scrim.className = 'modal-scrim';
    scrim.id = 'activeModal';
    scrim.addEventListener('click', (e)=>{
      if(e.target.id==='activeModal' && !(opts&&opts.persistent)) closeModal();
    });
    scrim.innerHTML = `<div class="modal-sheet">${innerHtml}</div>`;
    document.body.appendChild(scrim);
    return scrim;
  }
  function closeModal(){
    const m = qs('#activeModal');
    if(m) m.remove();
  }

  function generateCode(prefix){
    const rand = Math.random().toString(36).slice(2,7).toUpperCase();
    return `${prefix||'H4C'}-${rand}`;
  }

  /* ---- Scaffold helper for views awaiting full build-out ----
     Keeps every unbuilt view visually consistent and on-brand
     instead of a blank screen, while making it obvious what's
     still pending vs. what's live. */
  function renderBuildPending(container, opts){
    opts = opts || {};
    const icon = opts.icon || '🧩';
    const title = opts.title || 'Module scaffolded';
    const desc = opts.desc || 'Structure, routing and layout are ready. Business logic will be built in a future step.';
    const stats = opts.stats || [];
    const actions = opts.actions || [];

    container.innerHTML = `
      <div class="stack">
        ${stats.length ? `<div class="grid-2">
          ${stats.map(s=>`<div class="stat-card"><div class="stat-label">${esc(s.label)}</div><div class="stat-value">${esc(s.value)}</div></div>`).join('')}
        </div>` : ''}
        <div class="build-pending">
          <div style="font-size:32px;margin-bottom:8px;">${icon}</div>
          <div><b>${esc(title)}</b></div>
          <div class="mt-8">${esc(desc)}</div>
        </div>
        ${actions.length ? `<div class="stack">${actions.map(a=>`<button class="btn ${a.variant||'btn-tonal'} btn-block" data-go="${a.path}">${a.label}</button>`).join('')}</div>` : ''}
      </div>
    `;
    qsa('[data-go]', container).forEach(btn=>{
      btn.addEventListener('click', ()=>window.CouponRouter.navigate(btn.getAttribute('data-go')));
    });
  }

  window.CouponUtils = {
    esc, todayISO, formatDate, formatDateTime, addDays,
    qs, qsa, toast, openModal, closeModal, generateCode, renderBuildPending
  };

})(window);
