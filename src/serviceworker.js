const CACHE_NAME = "vta";
const urlsToCache = [
    "/",
    "/style.css",
    "/main.js",
    "/icon/512.png"
];


async function waitCache() {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(urlsToCache);
}

function installListener(e) {
    e.waitUntil(waitCache());
}

async function fetchCache(req) {
    const netRes = await fetch(req);
    const cache = await caches.open(CACHE_NAME);
    cache.put(req, netRes.clone());
    return netRes;
}

async function waitFetch(e) {
    const res = await caches.match(e.request);
    const fetchPr = fetchCache(e.request);
    return (
        res !== undefined
        ? res
        : fetchPr
    );
}

function fetchListener(e) {
    e.waitUntil(waitFetch(e));
}

self.addEventListener("install", installListener);
self.addEventListener("fetch", fetchListener);
