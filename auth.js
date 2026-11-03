// Google でログイン（Google Identity Services）。
// ID トークンは1時間で切れるので、切れる前に自動で取り直す。
// DriveTracker の auth.js をもとに、読み込み方だけ変えた（<script> で読み込み、window.HDAuth に公開）。
(function () {
  class NeedLogin extends Error {}

  let token = null, exp = 0, who = null, inited = false;
  const waiters = [], listeners = [];

  function config() {
    return Object.assign({ clientId: '', apiUrl: '' }, window.APP_CONFIG);
  }

  function payload(t) {
    const b = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(b))));
  }

  function accept(t) {
    const p = payload(t);
    token = t; exp = p.exp * 1000; who = p.email;
    try { sessionStorage.setItem('hd_idToken', t); } catch (e) { /* noop */ }
    waiters.splice(0).forEach(w => w.resolve(t));
    listeners.forEach(fn => fn(who));
  }

  try {
    const saved = sessionStorage.getItem('hd_idToken');
    if (saved && payload(saved).exp * 1000 > Date.now() + 120000) {
      token = saved; exp = payload(saved).exp * 1000; who = payload(saved).email;
    }
  } catch (e) { /* noop */ }

  function gis(timeoutMs) {
    timeoutMs = timeoutMs || 8000;
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      (function wait() {
        if (window.google && google.accounts && google.accounts.id) {
          if (!inited) {
            google.accounts.id.initialize({
              client_id: config().clientId,
              callback: r => accept(r.credential),
              auto_select: true,
              use_fedcm_for_prompt: true,
              cancel_on_tap_outside: false
            });
            inited = true;
          }
          resolve(google.accounts.id);
        } else if (Date.now() - t0 > timeoutMs) {
          reject(new NeedLogin('Googleのログイン部品を読み込めませんでした'));
        } else {
          setTimeout(wait, 150);
        }
      })();
    });
  }

  /** 有効なトークンを返す。なければ前回のアカウントで自動ログインを試し、だめなら NeedLogin */
  async function getToken() {
    if (token && exp - Date.now() > 120000) return token;
    const id = await gis();
    return new Promise((resolve, reject) => {
      const w = { resolve, reject };
      waiters.push(w);
      id.prompt();
      setTimeout(() => {
        const i = waiters.indexOf(w);
        if (i >= 0) { waiters.splice(i, 1); reject(new NeedLogin()); }
      }, 7000);
    });
  }

  /** ログインボタンを置く */
  function renderButton(el) {
    gis().then(id => {
      el.innerHTML = '';
      id.renderButton(el, { theme: 'outline', size: 'large', shape: 'pill', text: 'signin_with', locale: 'ja' });
    }).catch(() => {
      el.textContent = 'ログインには電波が必要です';
    });
  }

  function signOut() {
    token = null; exp = 0; who = null;
    try { sessionStorage.removeItem('hd_idToken'); } catch (e) { /* noop */ }
    if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect();
  }

  window.HDAuth = {
    NeedLogin: NeedLogin,
    config: config,
    getToken: getToken,
    renderButton: renderButton,
    signOut: signOut,
    email: () => who,
    onLogin: fn => listeners.push(fn)
  };
})();
