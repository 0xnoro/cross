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
const studioPhotos = {'Монстр Про':'monster-pro','Монстр 2 Про':'monster-2-pro','Титан Про':'titan-pro','Титан 2 Про':'titan-2-pro','U2 CROSS':'u2','U2PRO Premium':'u2pro-premium'};
const photo = m => `./assets/studio/${studioPhotos[m.name]}.webp`;
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
function card(base) {
  const s = settings.get(base.id), m=selectedModel(base), key=base.id;
  const versions=models.filter(item=>item.name===m.name);
  return `<article class="bike-card" data-id="${key}" aria-labelledby="title-${key}">
    <div class="bike-heading"><div><h3 id="title-${key}">${m.name}</h3><p>${m.version}</p></div><span class="brand-stamp">CROSS</span></div>
    <div class="bike-photo"><img src="${photo(m)}" alt="${m.name}, витринное изображение модели" width="1600" height="1200" loading="lazy"></div>
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
    <div class="build-summary" data-summary>${summary(m,s)}</div><div class="build-total"><span>Велосипед и АКБ</span><strong data-total>${money(m.prices[s.battery])}</strong></div><button class="save-build" data-order>Оформить заказ</button></div>
  </article>`;
}
function summary(m,s) { return `${m.name}, ${m.version}<br>Аккумулятор: ${m.labels[s.battery]}<br>Сиденье: ${seats[s.seat].toLowerCase()}${m.id==='u2-premium'?`<br>Цвет: ${s.color==='black'?'чёрный':'серебристый'}`:''}${s.seat ? '<br><small>Стоимость выбранного сиденья не включена.</small>':''}`; }
let renderRevision = 0;
function render(animate = false) {
  const revision = ++renderRevision;
  const opacity = getComputedStyle(feed).opacity;
  feed.getAnimations().forEach(animation => animation.cancel());
  animate = animate && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shown = baseModels.filter(m=>family==='all'||m.family===family);
  const sort = document.querySelector('#sort').value;
  if(sort!=='default') shown.sort((a,b)=>(selectedModel(a).prices[settings.get(a.id).battery]-selectedModel(b).prices[settings.get(b.id).battery])*(sort==='price'?1:-1));
  const html = shown.map(card).join('');
  function commit() {
    const focusedId = feed.contains(document.activeElement) ? document.activeElement.id : null;
    feed.innerHTML = html;
    document.querySelector('#result-count').textContent = `Моделей: ${shown.length}`;
    feed.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.parentElement.classList.add('image-error');img.alt='Фотография не загрузилась. Обновите страницу.';}));
    if (focusedId) document.getElementById(focusedId)?.focus({preventScroll:true});
  }
  if (!animate) { commit(); return; }
  const leaving = feed.animate([{opacity},{opacity:0}], {duration:140, easing:'ease-out', fill:'forwards'});
  leaving.finished.then(() => {
    if (revision !== renderRevision) return;
    const oldHeight = feed.getBoundingClientRect().height;
    commit();
    const newHeight = feed.getBoundingClientRect().height;
    leaving.cancel();
    feed.animate([
      {opacity:0, height:`${oldHeight}px`, transform:'translateY(6px)'},
      {opacity:1, height:`${newHeight}px`, transform:'translateY(0)'}
    ], {duration:320, easing:'cubic-bezier(.22,1,.36,1)'});
  }).catch(() => {});
}
document.querySelectorAll('[data-family]').forEach(button=>button.addEventListener('click',()=>{
  family=button.dataset.family;
  document.querySelectorAll('[data-family]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  render(true);
}));
document.querySelector('#sort').addEventListener('change',()=>render(true));
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
  if(el.matches('[data-battery]') && document.querySelector('#sort').value!=='default') {
    render(true);
    document.getElementById(`battery-${base.id}`).focus({preventScroll:true});
  }
});
feed.addEventListener('click',event=>{
  const button=event.target.closest('button'), article=button?.closest('[data-id]');if(!article)return;
  const base=models.find(m=>m.id===article.dataset.id),s=settings.get(base.id),m=selectedModel(base);
  if(button.matches('[data-configure]')){
    s.open=!s.open;button.setAttribute('aria-expanded',String(s.open));button.innerHTML=`${s.open?'Свернуть конфигурацию':'Подобрать конфигурацию'}${arrow}`;
    const panel=article.querySelector('.configuration');
    const height=panel.hidden?0:panel.getBoundingClientRect().height;
    const style=getComputedStyle(panel);
    const paddingTop=panel.hidden?'0px':style.paddingTop;
    const paddingBottom=panel.hidden?'0px':style.paddingBottom;
    const opacity=panel.hidden?0:style.opacity;
    panel.getAnimations().forEach(animation=>animation.cancel());
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){
      panel.hidden=!s.open;
      panel.inert=!s.open;
      return;
    }
    panel.hidden=false;
    panel.inert=!s.open;
    const targetStyle=getComputedStyle(panel);
    const end={height:s.open?`${panel.getBoundingClientRect().height}px`:'0px',paddingTop:s.open?targetStyle.paddingTop:'0px',paddingBottom:s.open?targetStyle.paddingBottom:'0px',opacity:s.open?1:0};
    const animation=panel.animate([
      {height:`${height}px`,paddingTop,paddingBottom,opacity,overflow:'hidden'},
      {...end,overflow:'hidden'}
    ],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
    animation.finished.then(()=>{panel.hidden=!s.open;}).catch(()=>{});
  }
  if(button.matches('[data-order]')){
    const root=document.querySelector('#order-configuration');
    root.innerHTML=summary(m,s)+`<br><strong>${money(m.prices[s.battery])}</strong>`;
    document.querySelector('#order-dialog').showModal();
  }
});
render();
document.querySelectorAll('[data-battery-enquiry]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelector('#battery-dialog-title').textContent=button.dataset.batteryEnquiry;
  document.querySelector('#battery-dialog').showModal();
}));
document.querySelectorAll('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
for(const id of ['battery-dialog']) {
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
    track.append(clone);
  });
  rail.append(track);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let animation=null,visible=false,lastDistance=0;
  function update() {
    const paused=reduced.matches||!visible||document.hidden||!!document.querySelector('dialog[open]');
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
  document.addEventListener('visibilitychange',update);
  reduced.addEventListener('change',()=>{layout();update();});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update();}).observe(rail);
  new ResizeObserver(layout).observe(rail);
  layout();
}
initShopMotion();
