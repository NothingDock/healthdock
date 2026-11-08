// HealthDock サービスワーカー：画面（HTML / JS / アイコン）をキャッシュしてオフラインでも開けるようにする。
// データは Apps Script（別オリジン）から取るのでキャッシュしない（直前のデータはページ側が localStorage に保持）。
// GitHub Pages の /healthdock/ の下で動くよう、パスはすべて sw.js からの相対にしている。
// 同じ nothingdock.github.io に DriveTracker など別のアプリも置くので、
// 消してよいのは「healthdock-」で始まる自分のキャッシュだけにしている。
const PREFIX = 'healthdock-';
const CACHE = PREFIX + 'v3';
const SHELL = ['./', 'theme.js', 'config.js', 'auth.js', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png'];
const scope = self.registration.scope;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // 自分の置き場所（/healthdock/）の中だけ扱う
  if (e.request.method !== 'GET' || !url.href.startsWith(scope)) return;
  const isIndex = url.href === scope || url.pathname.endsWith('/index.html');
  const key = isIndex ? scope : e.request;
  // ネットワーク優先、失敗したらキャッシュ
  e.respondWith(fetch(e.request).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(key, copy));
    return res;
  }).catch(() => caches.open(CACHE).then(c => c.match(key))));
});
