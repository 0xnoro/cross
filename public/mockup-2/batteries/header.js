function updateSavedCount() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem('cross-build-v2')); } catch {}
  document.querySelector('#saved-count').textContent = saved && typeof saved.id === 'string' && Number.isInteger(saved.battery) && Number.isInteger(saved.seat) ? '1' : '0';
}
updateSavedCount();
window.addEventListener('pageshow', updateSavedCount);
window.addEventListener('storage', updateSavedCount);
