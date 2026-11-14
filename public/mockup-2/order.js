const orderDialog = document.querySelector('#order-dialog');
const form = document.querySelector('#order-form');
const contact = form.elements.contact;
function updateContact() {
  const telegram = form.elements.method.value === 'Telegram';
  contact.type = telegram ? 'text' : 'tel';
  contact.placeholder = telegram ? '@username или номер телефона' : '+7 999 123-45-67';
  contact.autocomplete = telegram ? 'off' : 'tel';
}
form.elements.method.addEventListener('change', updateContact);
updateContact();
document.querySelector('#close-order').addEventListener('click', () => orderDialog.close());
orderDialog.addEventListener('click', event => {
  if (event.target !== orderDialog) return;
  const r = orderDialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) orderDialog.close();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const text = ['Заказ CROSS', document.querySelector('#order-configuration').innerText,
    `Имя: ${data.get('name').trim()}`, data.get('age') ? `Возраст: ${data.get('age')}` : '',
    `Способ связи: ${data.get('method')}`, `Контакт: ${data.get('contact').trim()}`,
    data.get('comment').trim()].filter(Boolean).join('\n');
  window.location.href = `https://t.me/bike_cross?text=${encodeURIComponent(text)}`;
});
