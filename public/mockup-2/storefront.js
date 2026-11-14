const money = value => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
const batteryLabels = ['Без аккумулятора', '60 В · 21 А·ч', '2 × 60 В · 21 А·ч', '60 В · 30 А·ч'];
const largeLabels = ['Без аккумулятора', '60 В · 30 А·ч', '2 × 60 В · 30 А·ч'];
const models = [
  {id:'monster-800',family:'monster',name:'Монстр Про',version:'800 Вт',photo:3,prices:[27500,44500,62000,52000],labels:batteryLabels,detail:'Стандартная подвеска'},
  {id:'monster-1200',family:'monster',name:'Монстр Про',version:'1200 Вт',photo:10,prices:[29000,46000,64500,54000],labels:batteryLabels,detail:'Стандартная подвеска'},
  {id:'monster-800-dual',family:'monster',name:'Монстр Про',version:'800 Вт · двойная подвеска',photo:15,prices:[31500,48000,67000,56000],labels:batteryLabels,detail:'4 задних амортизатора'},
  {id:'monster-1200-dual',family:'monster',name:'Монстр Про',version:'1200 Вт · двойная подвеска',photo:22,prices:[33000,50000,68000,57000],labels:batteryLabels,detail:'4 задних амортизатора'},
  {id:'monster-2',family:'monster',name:'Монстр 2 Про',version:'1200 Вт',photo:32,prices:[30500,47500,66000,55500],labels:batteryLabels,detail:'Смарт-карта и задний ход'},
  {id:'monster-2-suspension',family:'monster',name:'Монстр 2 Про',version:'1200 Вт · с амортизаторами',photo:36,prices:[33500,50500,68000,58000],labels:batteryLabels,detail:'Двухпоршневые тормоза'},
  {id:'titan-pro',family:'titan',name:'Титан Про',version:'1200 Вт',photo:49,prices:[37000,59990,86000],labels:largeLabels,detail:'Аккумулятор LiFePO₄'},
  {id:'titan-2',family:'titan',name:'Титан 2 Про',version:'1200 Вт',photo:56,prices:[39000,62000,88000],labels:largeLabels,detail:'LiFePO₄ · задний ход'},
  {id:'u2',family:'u2',name:'U2 CROSS',version:'1500 Вт',photo:59,prices:[53900,74900,99000],labels:largeLabels,detail:'LiFePO₄ · задняя подвеска'},
  {id:'u2-premium',family:'u2',name:'U2PRO Premium',version:'3000 Вт',photo:71,prices:[64000,94000],labels:['Без аккумулятора','60 В · 45 А·ч'],detail:'LiFePO₄ · 4 режима скорости'}
];
const seats = ['Штатное', 'Широкое', 'Удлинённое', 'Со спинкой'];
const settings = new Map(models.map(m => [m.id, {battery:1,seat:0,open:false}]));
const feed = document.querySelector('#feed');
let family = 'all';
let saved = null;
try {
  const candidate = JSON.parse(localStorage.getItem('cross-build-v2'));
  const model = models.find(m => m.id === candidate?.id);
  if (model && Number.isInteger(candidate.battery) && model.prices[candidate.battery] !== undefined && Number.isInteger(candidate.seat) && seats[candidate.seat]) saved = candidate;
} catch {}
const photo = m => `./assets/catalog/photo-${m.photo}.webp`;
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
function card(m) {
  const s = settings.get(m.id);
  return `<article class="bike-card" data-id="${m.id}" aria-labelledby="title-${m.id}">
    <div class="bike-heading"><div><h3 id="title-${m.id}">${m.name}</h3><p>${m.version}</p></div><span class="brand-stamp">CROSS</span></div>
    <div class="bike-photo"><img src="${photo(m)}" alt="${m.name}, ${m.version}, фотография из магазина CROSS" width="1000" height="750" loading="lazy"><span class="photo-detail">${m.detail}</span></div>
    <div class="purchase"><label class="battery-label" for="battery-${m.id}">Аккумулятор<select id="battery-${m.id}" data-battery>${m.labels.map((l,i)=>`<option value="${i}" ${s.battery===i?'selected':''}>${l}</option>`).join('')}</select></label>
    <div class="price-row"><strong data-price>${money(m.prices[s.battery])}</strong><span data-price-note>${s.battery?'велосипед + АКБ':'велосипед без АКБ'}</span></div>
    <button class="configure" data-configure aria-expanded="${s.open}" aria-controls="config-${m.id}">${s.open?'Свернуть конструктор':'Собрать велосипед'}${arrow}</button></div>
    <div class="configuration" id="config-${m.id}" ${s.open?'':'hidden'}><fieldset><legend>Какое сиденье?</legend><div class="seat-options">${seats.map((seat,i)=>`<label><input type="radio" name="seat-${m.id}" value="${i}" ${s.seat===i?'checked':''}><span>${seat}</span></label>`).join('')}</div></fieldset><p class="seat-note">Варианты сидений для примерки комплектации. Доплата и совместимость пока не заданы; на фото штатный вариант.</p><div class="build-summary" data-summary>${summary(m,s)}</div><button class="save-build" data-save>Сохранить сборку</button><p class="save-status" role="status"></p></div>
  </article>`;
}
function summary(m,s) { return `${m.labels[s.battery]}<br>Сиденье: ${seats[s.seat].toLowerCase()}${s.seat ? '<br><small>Стоимость выбранного сиденья не включена.</small>':''}`; }
function render() {
  const shown = models.filter(m=>family==='all'||m.family===family);
  const sort = document.querySelector('#sort').value;
  if(sort!=='default') shown.sort((a,b)=>(a.prices[settings.get(a.id).battery]-b.prices[settings.get(b.id).battery])*(sort==='price'?1:-1));
  feed.innerHTML = shown.map(card).join('');
  document.querySelector('#result-count').textContent = `Моделей: ${shown.length}`;
  feed.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.parentElement.classList.add('image-error');img.alt='Фотография не загрузилась. Обновите страницу.';}));
}
document.querySelectorAll('[data-family]').forEach(button=>button.addEventListener('click',()=>{
  family=button.dataset.family;
  document.querySelectorAll('[data-family]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  render();
}));
document.querySelector('#sort').addEventListener('change',render);
feed.addEventListener('change',event=>{
  const el=event.target, article=el.closest('[data-id]'); if(!article) return;
  const m=models.find(m=>m.id===article.dataset.id), s=settings.get(m.id);
  if(el.matches('[data-battery]')) s.battery=Number(el.value);
  if(el.matches('input[type="radio"]')) s.seat=Number(el.value);
  article.querySelector('[data-price]').textContent=money(m.prices[s.battery]);
  article.querySelector('[data-price-note]').textContent=s.battery?'велосипед + АКБ':'велосипед без АКБ';
  article.querySelector('[data-summary]').innerHTML=summary(m,s);
  article.querySelector('.save-status').textContent='';
  if(el.matches('[data-battery]') && document.querySelector('#sort').value!=='default') {
    render();
    document.getElementById(`battery-${m.id}`).focus({preventScroll:true});
  }
});
feed.addEventListener('click',event=>{
  const button=event.target.closest('button'), article=button?.closest('[data-id]');if(!article)return;
  const m=models.find(m=>m.id===article.dataset.id),s=settings.get(m.id);
  if(button.matches('[data-configure]')){
    s.open=!s.open;button.setAttribute('aria-expanded',String(s.open));button.innerHTML=`${s.open?'Свернуть конструктор':'Собрать велосипед'}${arrow}`;
    article.querySelector('.configuration').hidden=!s.open;
  }
  if(button.matches('[data-save]')){
    saved={id:m.id,battery:s.battery,seat:s.seat};
    let persisted=true;try{localStorage.setItem('cross-build-v2',JSON.stringify(saved));}catch{persisted=false;}
    document.querySelector('#saved-count').textContent='1';
    article.querySelector('.save-status').textContent=persisted?'Сборка сохранена. Открой «Моя сборка» вверху.':'Сборка сохранена только до закрытия страницы: хранилище браузера недоступно.';
  }
});
const dialog=document.querySelector('#saved-dialog');
function renderSaved(){
  const root=document.querySelector('#saved-content');
  if(!saved){root.innerHTML='<p>Пока нет сохранённой сборки.</p><p>Выбери велосипед, аккумулятор и сиденье в каталоге.</p><button class="save-build" data-return>К велосипедам</button>';return;}
  const m=models.find(m=>m.id===saved.id);
  root.innerHTML=`<img class="saved-photo" src="${photo(m)}" alt="${m.name}"><h3>${m.name}</h3><p>${m.version}</p><p>${summary(m,saved)}</p><strong class="saved-price">${money(m.prices[saved.battery])}</strong><p class="seat-note">Стоимость велосипеда и выбранного АКБ по публикации CROSS. Это сохранённая комплектация, не отправленный заказ.</p><button class="save-build" data-edit>Изменить комплектацию</button><button class="remove-build" data-remove>Удалить сборку</button>`;
}
document.querySelector('#open-saved').addEventListener('click',()=>{renderSaved();dialog.showModal();});
document.querySelector('#close-saved').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{
  if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}
  if(event.target.matches('[data-remove]')){saved=null;try{localStorage.removeItem('cross-build-v2');}catch{}document.querySelector('#saved-count').textContent='0';renderSaved();}
  if(event.target.matches('[data-return]')){dialog.close();document.querySelector('[data-family]').focus();}
  if(event.target.matches('[data-edit]')){
    settings.set(saved.id,{battery:saved.battery,seat:saved.seat,open:true});
    document.querySelector('[data-family="all"]').click();dialog.close();
    const article=feed.querySelector(`[data-id="${saved.id}"]`);article.scrollIntoView({block:'start'});article.querySelector('[data-configure]').focus({preventScroll:true});
  }
});
document.querySelector('#saved-count').textContent=saved?'1':'0';
render();
