const header = document.querySelector('.header-inner');
const socials = document.querySelector('.social-links');
socials.classList.remove('wrap');
header.insertBefore(socials, header.querySelector('.saved-button'));
document.querySelector('.topline').remove();
const bikes = header.querySelector('nav a');
if (!location.pathname.includes('/batteries/')) bikes.setAttribute('aria-current', 'page');
