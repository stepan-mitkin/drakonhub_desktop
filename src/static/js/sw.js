// sw.js
// Minimal, safe “app shell” service worker for an editing app.
// Caches only the UI shell (static assets), not user data or API responses.

const CACHE_NAME = "app-cache-v1";

// Keep this list SMALL: only what’s required to boot the UI.
const APP_SHELL = [
  "../../../drakonhub",
  "../styles/reset.css",
  "../libs/quill.snow.css",
  "../styles/main.css",
  "../../../app.webmanifest",
  "../images/drakonpro-logo-256.png",
  "../libs/quill2.min.js",
  "../libs/mousetrap.min.js",
  "../libs/rounded.js",
  "../libs/drakongen.js",
  "client_config_github.js",
  "../strings/localization.js",
  "drcore.js",
  "utils.js",
  "dh2common.js",
  "drakon_canvas.js",
  "drakonhubwidget_10.js",
  "edit_tools.js",
  "html_0_1.js",
  "http_0_1.js",
  "simplewidgets_0_1.js",
  "standalone.js",
  "local.js",
  "pwa.js",
];

// Install: pre-cache app shell
self.addEventListener("install", function (event) {
  // Make the updated SW take control sooner (optional but usually desired).
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }),
  );
});

// Activate: clean up old caches
self.addEventListener("activate", function (event) {
  // Take control of uncontrolled clients right away (optional but usually desired).
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          }),
        );
      }),
    ]),
  );
});

// Fetch: cache-first for shell assets; network for everything else.
// This avoids caching API responses / user data accidentally.
self.addEventListener("fetch", function (event) {
  var request = event.request;

  // Only handle GET requests.
  if (request.method !== "GET") return;

  var url = new URL(request.url);

  // Only handle same-origin requests. Let cross-origin requests go to the network.
  if (url.origin !== self.location.origin) return;

  // Decide if request is "app shell" (static) or "dynamic".
  // You can extend this logic if your build outputs different file names.
  var isShell =
    url.pathname === "/" ||
    APP_SHELL.indexOf(url.pathname) !== -1 ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".webmanifest") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico");

  if (!isShell) {
    // Dynamic (e.g., /api/*): do not cache. Just go to network.
    return;
  }

  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) return cached;

      return fetch(request)
        .then(function (response) {
          // Cache successful same-origin responses for future loads.
          // (This is still "shell-ish" only because of isShell filter above.)
          if (response && response.ok) {
            var copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, copy);
            });
          }
          return response;
        })
        .catch(function () {
          // Offline fallback: if navigation fails, return index.html.
          // Useful for SPA routes and offline app start.
          if (request.mode === "navigate") {
            return caches.match("/index.html");
          }
          throw new Error("Network error and no cache match");
        });
    }),
  );
});
