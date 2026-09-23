// Shared DOM renderer: the editor preview and public site use the same markup.
export function renderGothicSupport(root, page, { heroUrl, preview = false }) {
  const make = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text !== undefined) node.textContent = text; return node; };
  const cat = () => {
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 40 40');svg.setAttribute('width','40');svg.setAttribute('height','40');svg.setAttribute('aria-hidden','true');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M7 19 6 5 17 12 Q21 10 25 12 L35 5 33 20 Q38 34 21 36 Q4 36 7 19 M12 24 16 24 M26 24 30 24 M19 29 23 29 M5 27 0 25 M5 30 0 31 M35 27 40 25 M35 30 40 31');path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','1.5');path.setAttribute('stroke-linecap','round');svg.append(path);return svg;
  };
  const prefix = preview ? 'preview-' : '';
  const section = (name) => '#' + prefix + name;
  const link = (text, href, cls) => { const node = make('a', cls, text); node.href = href; return node; };
  const names = { donatello: 'Donatello', donationalerts: 'DonationAlerts', streamlabs: 'Streamlabs', boosty: 'Boosty' };
  const marks = { donatello: 'D', donationalerts: 'DA', streamlabs: 'SL', boosty: 'b' };
  const contrast = color => { const rgb = [1,3,5].map(i => parseInt(color.slice(i,i+2),16)/255).map(c => c <= .04045 ? c/12.92 : ((c+.055)/1.055)**2.4); return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722 > .179 ? '#151020' : '#ffffff'; };
  root.replaceChildren(); root.classList.add('gothic-host');
  const view = make('div', 'sg-page');
  for (const [key, value] of Object.entries({ '--sg-bg': page.background || '#100d10', '--sg-panel': page.panel || '#191216', '--sg-text': page.text_color || '#f6e9df', '--sg-accent': page.accent || '#ca8295' })) view.style.setProperty(key, value);
  const header = make('header', 'sg-header');
  const brand = link('', section('home'), 'sg-brand'); brand.append(cat(), make('span', '', page.brand || 'Мой уютный эфир')); header.append(brand);
  const nav = make('nav', 'sg-nav'); nav.setAttribute('aria-label', 'Навигация страницы поддержки');
  for (const [text, id] of [['Главная','home'],['Донаты','donations'],...(page.show_about !== false ? [['О поддержке','about']] : [])]) nav.append(link(text, section(id), ''));
  header.append(nav, make('span', 'sg-header-note', 'С любовью к нашему эфиру ♡')); view.append(header);
  const hero = make('section', 'sg-hero'); hero.id = prefix + 'home';
  if (heroUrl) { const art = make('img', 'sg-hero-art'); art.src = heroUrl; art.alt = ''; art.width = 1536; art.height = 1024; hero.append(art, make('div','sg-hero-shade')); } else { hero.classList.add('sg-no-art'); }
  const copy = make('div','sg-hero-copy'); copy.append(make('p','sg-kicker','Твоя поддержка делает это возможным ♡'), make('h1','',page.title || 'Поддержать стрим'), make('p','sg-intro',page.description || 'Спасибо, что ты рядом. Каждая поддержка помогает создавать больше уютных эфиров.'));
  const actions = make('div','sg-actions'); actions.append(link('ฅ  Поддержать сейчас  →', section('donations'), 'sg-primary'),link('Все ссылки ↗', section('donations'), 'sg-secondary')); copy.append(actions,make('p','sg-small-paws','✦ Больше контента     ♡ Ближе друг к другу'));
  hero.append(copy); view.append(hero);
  const donations = make('section','sg-section'); donations.id = prefix + 'donations';
  donations.append(make('p','sg-ornament','❦   ♡   ❦'),make('h2','',page.links_title || 'Ссылки на донаты'),make('p','sg-section-note','Выбери удобный способ поддержки ♡'));
  const grid = make('div','sg-donation-grid'); if(page.button_layout === 'list') grid.classList.add('sg-list');
  for(const item of page.links) {
    const card = make('article','sg-donation-card'); const provider = names[item.provider] || item.provider;
    card.append(make('span','sg-card-bow','୨♡୧'),make('span','sg-provider sg-provider-'+item.provider,marks[item.provider] || '♡'),make('h3','',provider),make('p','',item.caption || 'Твоя поддержка — больше уютных эфиров'));
    const button = make('a','sg-primary',item.label?.trim() || 'Поддержать →'); if(!preview) button.href = item.url; button.title=provider; button.rel='noopener noreferrer';
    button.style.background = item.color || '#8f283c'; button.style.color=contrast(item.color || '#8f283c'); button.style.borderRadius=page.button_shape==='pill'?'999px':page.button_shape==='square'?'6px':'13px';
    card.append(button); grid.append(card);
  }
  if(!page.links.length) grid.append(make('p','sg-empty','Добавь ссылки сервисов в настройках страницы.'));
  donations.append(grid); view.append(donations);
  if(page.show_about !== false) {
    const about=make('section','sg-section sg-about'); about.id=prefix+'about';
    about.append(make('p','sg-ornament','❦'),make('h2','',page.about_title || 'На что идут донаты'),make('p','sg-section-note',page.about_text || 'Твоя поддержка помогает становиться лучше ♡'));
    const purposes=make('div','sg-purposes');
    const defaults=[{title:'Новые стримы',text:'Больше интересного контента, игр и коллабораций.'},{title:'Оформление канала',text:'Красивые оверлеи, иллюстрации и новые детали.'},{title:'Качество эфиров',text:'Лучший звук, картинка и комфортные стримы.'}];
    (page.purposes || defaults).forEach((item,index)=>{const card=make('article','sg-purpose');card.append(make('span','sg-purpose-icon',['☾','✦','♡'][index]||'✦'));const body=make('div','');body.append(make('h3','',item.title),make('p','',item.text));card.append(body);purposes.append(card)});
    about.append(purposes); view.append(about);
  }
  const thanks=make('div','sg-thanks');thanks.append(cat(),make('p','',page.thank_you || 'Спасибо, что поддерживаешь мой канал ♡')); view.append(thanks);
  const footer=make('footer','sg-footer');footer.append(make('span','sg-brand',page.brand || 'Мой уютный эфир'),make('p','','Оплата проходит на сайте выбранного сервиса. Kitsu Studio не запрашивает данные карты.'),link('Наверх ↑',section('home'),''));view.append(footer);
  root.append(view);
}
