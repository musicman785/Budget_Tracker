const STATIC_CACHE = "static-cache-v2";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/app.js",
  "/styleS.css",
  "/index.js",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];
//Install service worker
//=========================================
self.addEventListener("install", (evt) => {
  //   console.log("Service worker has been installed!");
  evt.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("your files were cached!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  //self.skipWaiting()
});

//Activate service worker
//=========================================

self.addEventListener("activate", (evt) => {
  //   console.log("Service worker had been activated!");
  evt.waitUntil(
    caches.keys().then((keys) => {
      // console.log(keys)
      return Promise.all(keys.
        .filter(key => key !== STATIC_CACHE)
        .map(key => caches.delete(key)))
    })
  );
});

//Fetch request
//=========================================

self.addEventListener("fetch", (evt) => {
  //   console.log("Fetch event", evt);
  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      return cacheRes || fetch(evt.request);
    })
  );
});