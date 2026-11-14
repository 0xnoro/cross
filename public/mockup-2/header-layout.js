const shell = document.querySelector('.header');
let floating = window.scrollY > 120;
function updateHeaderPosition() {
  if (window.scrollY > 120) floating = true;
  else if (window.scrollY < 24) floating = false;
  shell.classList.toggle('is-floating', floating);
}
updateHeaderPosition();
window.addEventListener('scroll', updateHeaderPosition, { passive: true });
