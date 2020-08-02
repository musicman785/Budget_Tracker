const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "style.css",
  "index.js",
  "manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

const STATIC_CACHE = "static-cache-v2";
const DATA_CACHE = "data-cache-v1";

// Install
// =========================================

self.addEventListener("install", (e) => {
  e.waitUntil(
    cache.open(STATIC_CACHE).then((cache) => {
      console.log("Files chached succesfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipwaiting();
});
