const STATIC_CACHE = "static-cache-v1";
const DYNAMIC_CACHE = "dynamic-cache-v2";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/app.js",
  "/styles.css",
  "/index.js",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];
//Install service worker
//=========================================
self.addEventListener("install", evt => {

  evt.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("your files were cached!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting()
});

//Activate service worker
//=========================================

self.addEventListener("activate", evt => {

  evt.waitUntil(
    caches.keys().then(keys => {
      // console.log(keys)
      return Promise.all(keys
        .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
        .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

//Fetch request
//=========================================

self.addEventListener("fetch", evt => {


  evt.respondWith(
    caches.match(evt.request.url).then((cacheRes) => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(evt.request, fetchRes.clone());
          return fetchRes;
        })
      });
    }).catch(err => {
      return cache.match(evt.request);
    })
  );
});

// self.addEventListener("fetch", function (evt) {
//   if (evt.request.url.includes("/api/")) {
//     evt.respondWith(
//       caches.open(DYNAMIC_CACHE).then(cache => {
//         return fetch(evt.request)
//           .then(response => {
//             // If the response was good, clone it and store it in the cache.
//             if (response.status === 200) {
//               cache.put(evt.request.url, response.clone());
//             }
//             return response;
//           })
//           .catch(err => {
//             // Network request failed, try to get it from the cache.
//             return cache.match(evt.request);
//           });
//       }).catch(err => console.log(err))
//     );
//     return;
//   };
//   evt.respondWith(
//     caches.open(STATIC_CACHE).then(cache => {
//       return cache.match(evt.request).then(response => {
//         return response || fetch(evt.request);
//       });
//     })
//   );
// })