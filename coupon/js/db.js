/* ============================================================
   H4 COUPON — LocalStorage Database Layer
   Namespace: CouponDB
   Storage key is separate from the parent H4 ERP so both
   modules can run side-by-side without colliding.
   ============================================================ */
(function(window){
  'use strict';

  const STORAGE_KEY = 'h4_coupon_db_v1';
  const SESSION_KEY = 'h4_coupon_session_v1';

  function defaultData(){
    return {
      meta:{ version:1, createdAt:new Date().toISOString() },

      settings:{
        businessName:'H4 Construction Solutions',
        logo:'',
        theme:'light',              // 'light' | 'dark'
        couponPrefix:'H4C',
        couponSeq:1,
        pointsPerAmount:1,          // points earned per `amountPerPoints` spent
        amountPerPoints:100,        // e.g. 1 point per ₹100
        pointsExpiryDays:365,
        rewardsEnabled:true,
        lowStockRewardThreshold:5
      },

      // Coupon-module users are independent from ERP users (different login).
      users:[
        { id:1, name:'Admin', username:'admin', password:'admin123', role:'Admin' }
      ],

      // { id, name, mobile, email, points, tier, joinedAt }
      customers:[],

      // { id, code, type: 'discount'|'points'|'reward', value, status: 'active'|'used'|'expired'|'cancelled',
      //   customerId, createdAt, usedAt, expiresAt, note }
      coupons:[],

      // { id, name, pointsCost, stock, active, description }
      rewards:[],

      // { id, customerId, rewardId, pointsUsed, date }
      redemptions:[],

      // { id, code, result: 'valid'|'invalid'|'expired'|'used', date, by }
      scanLog:[],

      // generic audit trail, mirrors the ERP's activity log pattern
      activityLog:[]
    };
  }

  function deepFill(target, defaults){
    Object.keys(defaults).forEach(key=>{
      if(target[key]===undefined){ target[key] = defaults[key]; }
      else if(defaults[key] && typeof defaults[key]==='object' && !Array.isArray(defaults[key]) && typeof target[key]==='object'){
        deepFill(target[key], defaults[key]);
      }
    });
  }

  function load(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw){
        const fresh = defaultData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        return fresh;
      }
      const parsed = JSON.parse(raw);
      deepFill(parsed, defaultData());
      return parsed;
    }catch(e){
      console.error('[CouponDB] load failed, resetting to defaults', e);
      return defaultData();
    }
  }

  let DATA = load();

  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
  }

  function uid(){
    return Date.now() + Math.floor(Math.random()*1000);
  }

  function log(type, message, byUserName){
    DATA.activityLog.push({
      id:uid(), type, message,
      user: byUserName || (getSession() ? getSession().name : 'System'),
      ts: new Date().toISOString()
    });
    if(DATA.activityLog.length>1000) DATA.activityLog = DATA.activityLog.slice(-1000);
  }

  /* ---- Session (separate from ERP session) ---- */
  function setSession(user){
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id:user.id, name:user.name, role:user.role }));
  }
  function getSession(){
    try{ return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }catch(e){ return null; }
  }
  function clearSession(){
    sessionStorage.removeItem(SESSION_KEY);
  }

  /* ---- Public API ---- */
  window.CouponDB = {
    get data(){ return DATA; },
    load, save, uid, log,
    setSession, getSession, clearSession,
    reset(){ localStorage.removeItem(STORAGE_KEY); DATA = load(); },
    replaceAll(newData){ DATA = newData; deepFill(DATA, defaultData()); save(); }
  };

})(window);
