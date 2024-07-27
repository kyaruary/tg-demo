self.addEventListener('fetch', e => {
  e.respondWith(
    (async () => {
      const response = await fetch(e.request);
      return response;
    })()
  );
});
