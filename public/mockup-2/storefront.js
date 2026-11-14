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
const baseModels = models.filter((model,index)=>models.findIndex(item=>item.name===model.name)===index);
const settings = new Map(baseModels.map(m => [m.id, {modelId:m.id,battery:1,seat:0,color:'silver',open:false}]));
const selectedModel = (base) => models.find(m=>m.id===settings.get(base.id).modelId && m.name===base.name) || base;
const feed = document.querySelector('#feed');
let family = 'all';
let saved = null;
try {
  const candidate = JSON.parse(localStorage.getItem('cross-build-v2'));
  const model = models.find(m => m.id === candidate?.id);
  if (model && Number.isInteger(candidate.battery) && model.prices[candidate.battery] !== undefined && Number.isInteger(candidate.seat) && seats[candidate.seat]) saved = {...candidate,color:candidate.color==='black'?'black':'silver'};
} catch {}
const studioPhotos = {'Монстр Про':'monster-pro','Монстр 2 Про':'monster-2-pro','Титан Про':'titan-pro','Титан 2 Про':'titan-2-pro','U2 CROSS':'u2','U2PRO Premium':'u2pro-premium'};
const photo = m => `./assets/studio/${studioPhotos[m.name]}.webp`;
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
function card(base) {
  const s = settings.get(base.id), m=selectedModel(base), key=base.id;
  const versions=models.filter(item=>item.name===m.name);
  return `<article class="bike-card" data-id="${key}" aria-labelledby="title-${key}">
    <div class="bike-heading"><div><h3 id="title-${key}">${m.name}</h3><p>${m.version}</p></div><span class="brand-stamp">CROSS</span></div>
    <div class="bike-photo"><img src="${photo(m)}" alt="${m.name}, витринное изображение модели" width="1600" height="1200" loading="lazy"><span class="photo-detail">${m.detail}</span></div>
    <div class="purchase"><p class="chosen-battery" data-chosen-battery>${m.labels[s.battery]}</p>
    <div class="price-row"><strong data-price>${money(m.prices[s.battery])}</strong><span data-price-note>${s.battery?'велосипед + АКБ':'велосипед без АКБ'}</span></div>
    <button class="configure" data-configure aria-expanded="${s.open}" aria-controls="config-${key}">${s.open?'Свернуть конфигурацию':'Подобрать конфигурацию'}${arrow}</button></div>
    <div class="configuration" id="config-${key}" ${s.open?'':'hidden'}>
    <h4>Конфигурация</h4>
    <div class="fixed-version"><span>Модель</span><strong>${base.name}</strong></div>
    ${versions.length>1?`<label class="config-field" for="version-${key}">Мощность и подвеска<select id="version-${key}" data-version>${versions.map(v=>`<option value="${v.id}" ${v.id===m.id?'selected':''}>${v.version}${v.id==='monster-2'?' · базовая версия':''}</option>`).join('')}</select></label>`:`<div class="fixed-version"><span>Мощность и оснащение</span><strong>${m.version} · ${m.detail}</strong></div>`}
    <label class="config-field" for="battery-${key}">Аккумулятор<select id="battery-${key}" data-battery>${m.labels.map((l,i)=>`<option value="${i}" ${s.battery===i?'selected':''}>${l} (${money(m.prices[i])})</option>`).join('')}</select><small>В скобках стоимость велосипеда с выбранным аккумулятором.</small></label>
    <fieldset><legend>Сиденье</legend><div class="seat-options">${seats.map((seat,i)=>`<label><input type="radio" name="seat-${key}" value="${i}" ${s.seat===i?'checked':''}><span>${seat}</span></label>`).join('')}</div></fieldset>
    ${m.id==='u2-premium'?`<label class="config-field color-field" for="color-${key}">Цвет<select id="color-${key}" data-color><option value="silver" ${s.color==='silver'?'selected':''}>Серебристый</option><option value="black" ${s.color==='black'?'selected':''}>Чёрный</option></select><small>Оба цвета упомянуты в анонсе. На фото серебристый; наличие не подтверждено.</small></label>`:''}
    <div class="build-summary" data-summary>${summary(m,s)}</div><div class="build-total"><span>Велосипед и АКБ</span><strong data-total>${money(m.prices[s.battery])}</strong></div><button class="save-build" data-order>Оформить заказ</button><button class="remove-build" data-save>Сохранить сборку</button><p class="save-status" role="status"></p></div>
  </article>`;
}
function summary(m,s) { return `${m.name}, ${m.version}<br>Аккумулятор: ${m.labels[s.battery]}<br>Сиденье: ${seats[s.seat].toLowerCase()}${m.id==='u2-premium'?`<br>Цвет: ${s.color==='black'?'чёрный':'серебристый'}`:''}${s.seat ? '<br><small>Стоимость выбранного сиденья не включена.</small>':''}`; }
function render() {
  const shown = baseModels.filter(m=>family==='all'||m.family===family);
  const sort = document.querySelector('#sort').value;
  if(sort!=='default') shown.sort((a,b)=>(selectedModel(a).prices[settings.get(a.id).battery]-selectedModel(b).prices[settings.get(b.id).battery])*(sort==='price'?1:-1));
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
  const base=models.find(m=>m.id===article.dataset.id), s=settings.get(base.id);
  let m=selectedModel(base);
  if(el.matches('[data-version]')) {
    const next=models.find(item=>item.id===el.value && item.name===base.name);
    if(!next) return;
    const batteryLabel=m.labels[s.battery];
    s.modelId=next.id;
    s.battery=next.labels.includes(batteryLabel)?next.labels.indexOf(batteryLabel):1;
    s.color='silver';
    render();
    document.getElementById(`version-${base.id}`).focus({preventScroll:true});
    return;
  }
  if(el.matches('[data-battery]')) s.battery=Number(el.value);
  if(el.matches('input[type="radio"]')) s.seat=Number(el.value);
  if(el.matches('[data-color]')) s.color=el.value;
  article.querySelector('[data-price]').textContent=money(m.prices[s.battery]);
  article.querySelector('[data-price-note]').textContent=s.battery?'велосипед + АКБ':'велосипед без АКБ';
  article.querySelector('[data-summary]').innerHTML=summary(m,s);
  article.querySelector('[data-total]').textContent=money(m.prices[s.battery]);
  article.querySelector('[data-chosen-battery]').textContent=m.labels[s.battery];
  article.querySelector('.save-status').textContent='';
  if(el.matches('[data-battery]') && document.querySelector('#sort').value!=='default') {
    render();
    document.getElementById(`battery-${base.id}`).focus({preventScroll:true});
  }
});
feed.addEventListener('click',event=>{
  const button=event.target.closest('button'), article=button?.closest('[data-id]');if(!article)return;
  const base=models.find(m=>m.id===article.dataset.id),s=settings.get(base.id),m=selectedModel(base);
  if(button.matches('[data-configure]')){
    s.open=!s.open;button.setAttribute('aria-expanded',String(s.open));button.innerHTML=`${s.open?'Свернуть конфигурацию':'Подобрать конфигурацию'}${arrow}`;
    article.querySelector('.configuration').hidden=!s.open;
  }
  if(button.matches('[data-order]')){
    const root=document.querySelector('#order-configuration');
    root.innerHTML=summary(m,s)+`<br><strong>${money(m.prices[s.battery])}</strong>`;
    document.querySelector('#order-dialog').showModal();
  }
  if(button.matches('[data-save]')){
    saved={id:m.id,battery:s.battery,seat:s.seat,color:s.color};
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
    const model=models.find(m=>m.id===saved.id);
    const base=baseModels.find(m=>m.name===model.name);
    settings.set(base.id,{modelId:saved.id,battery:saved.battery,seat:saved.seat,color:saved.color,open:true});
    document.querySelector('[data-family="all"]').click();dialog.close();
    const article=feed.querySelector(`[data-id="${base.id}"]`);article.scrollIntoView({block:'start'});article.querySelector('[data-configure]').focus({preventScroll:true});
  }
});
document.querySelector('#saved-count').textContent=saved?'1':'0';
if(new URLSearchParams(location.search).get('saved')==='1') {
  renderSaved();
  dialog.showModal();
  const url=new URL(location.href);
  url.searchParams.delete('saved');
  history.replaceState(null,'',url);
}
render();
document.querySelectorAll('[data-battery-enquiry]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelector('#battery-dialog-title').textContent=button.dataset.batteryEnquiry;
  document.querySelector('#battery-dialog').showModal();
}));
document.querySelectorAll('[data-shop-photo]').forEach(button=>button.addEventListener('click',()=>{
  const image=document.querySelector('#shop-full-photo');
  image.src=button.dataset.shopPhoto;
  image.alt=button.dataset.caption;
  document.querySelector('#photo-dialog-title').textContent=button.dataset.caption;
  document.querySelector('#photo-dialog').showModal();
}));
document.querySelectorAll('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
for(const id of ['battery-dialog','photo-dialog']) {
  const modal=document.getElementById(id);
  modal.addEventListener('click',event=>{
    if(event.target!==modal)return;
    const r=modal.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)modal.close();
  });
}

function initShopMotion() {
  const rail=document.querySelector('.shop-photos');
  const originals=[...rail.children];
  const track=document.createElement('div');
  track.className='shop-track';
  originals.forEach(item=>track.append(item));
  originals.forEach(item=>{
    const clone=item.cloneNode(true);
    clone.classList.add('shop-repeat');
    clone.setAttribute('aria-hidden','true');
    clone.tabIndex=-1;
    clone.addEventListener('click',()=>item.click());
    track.append(clone);
  });
  rail.append(track);
  const toggle=document.createElement('button');
  toggle.className='shop-motion-toggle';
  toggle.type='button';
  document.querySelector('.shop-contact').append(toggle);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let animation=null,manualPause=reduced.matches,hover=false,focused=false,visible=false,lastDistance=0;
  function update() {
    toggle.hidden=reduced.matches;
    toggle.textContent=manualPause?'Включить прокрутку':'Остановить прокрутку';
    toggle.setAttribute('aria-label',toggle.textContent+' фотографий');
    const paused=manualPause||hover||focused||!visible||document.hidden||!!document.querySelector('dialog[open]');
    if(animation) paused?animation.pause():animation.play();
  }
  function layout() {
    if(reduced.matches){animation?.cancel();animation=null;lastDistance=0;update();return;}
    const distance=track.children[originals.length].offsetLeft-track.children[0].offsetLeft;
    if(distance===lastDistance)return;
    lastDistance=distance;
    animation?.cancel();
    animation=track.animate([{transform:`translateX(-${distance}px)`},{transform:'translateX(0)'}],{duration:distance/24*1000,iterations:Infinity,easing:'linear'});
    update();
  }
  toggle.addEventListener('click',()=>{manualPause=!manualPause;update();});
  rail.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hover=true;update();}});
  rail.addEventListener('pointerleave',()=>{hover=false;update();});
  rail.addEventListener('pointerdown',()=>{manualPause=true;update();});
  rail.addEventListener('focusin',()=>{focused=true;update();});
  rail.addEventListener('focusout',()=>{focused=false;update();});
  document.addEventListener('visibilitychange',update);
  reduced.addEventListener('change',()=>{manualPause=reduced.matches;layout();update();});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update();}).observe(rail);
  new ResizeObserver(layout).observe(rail);
  new MutationObserver(update).observe(document.querySelector('#photo-dialog'),{attributes:true,attributeFilter:['open']});
  layout();
}
initShopMotion();
