/* ============================================================
   H4 COUPON — Login View
   Fully functional: this is core infrastructure (auth gate),
   not a feature module, so it is wired up completely.
   ============================================================ */
(function(){
  'use strict';

  function render(container){
    const biz = CouponDB.data.settings.businessName;
    container.innerHTML = `
      <div class="center" style="min-height:100vh;padding:24px;">
        <div style="width:100%;max-width:360px;">
          <div class="text-center mt-16" style="margin-bottom:28px;">
            <div style="font-size:40px;">🎟️</div>
            <h1 style="font-size:22px;font-weight:700;margin-top:8px;">H4 Coupon</h1>
            <div class="small">${CouponUtils.esc(biz)}</div>
          </div>

          <div class="card">
            <div class="field">
              <label>Username</label>
              <input id="loginUser" placeholder="admin" autocomplete="username">
            </div>
            <div class="field" style="margin-bottom:8px;">
              <label>Password</label>
              <input id="loginPass" type="password" placeholder="••••••••" autocomplete="current-password">
            </div>
            <div id="loginError" class="small" style="color:var(--md-error);margin-bottom:12px;display:none;">Invalid username or password.</div>
            <button class="btn btn-filled btn-block" id="loginBtn">Login</button>
          </div>

          <div class="small text-center mt-16">
            First time? Default login is <b>admin / admin123</b>.<br>
            This is a separate login from the H4 ERP.
          </div>
        </div>
      </div>
    `;

    const doLogin = ()=>{
      const u = CouponUtils.qs('#loginUser').value.trim();
      const p = CouponUtils.qs('#loginPass').value;
      const user = CouponDB.data.users.find(x=>x.username.toLowerCase()===u.toLowerCase() && x.password===p);
      if(!user){
        CouponUtils.qs('#loginError').style.display = 'block';
        return;
      }
      CouponDB.setSession(user);
      CouponDB.log('Login', `${user.name} logged in`);
      CouponDB.save();
      CouponRouter.navigate('/dashboard');
    };

    CouponUtils.qs('#loginBtn').addEventListener('click', doLogin);
    CouponUtils.qs('#loginPass').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
  }

  window.CouponViews = window.CouponViews || {};
  window.CouponViews.login = { render };

})();


