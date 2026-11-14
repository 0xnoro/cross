const shell = document.querySelector('.header');
function updateHeaderPosition() {
  shell.classList.toggle('is-floating', window.scrollY > 80);
}
updateHeaderPosition();
window.addEventListener('scroll', updateHeaderPosition, { passive: true });
