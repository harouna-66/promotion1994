/* ====== CONFIGURATION ====== */
const WHATSAPP_NUMBER = "22376055917"; // Numéro WhatsApp au format international (sans le +)
const CONTACT_EMAIL = "contact@exemple.org"; // Gardé au cas où, mais non utilisé pour le formulaire

/* Menu mobile */
function toggleMenu(){document.getElementById('nav').classList.toggle('show');}

/* Apparition au défilement */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* Onglets */
function openTab(id,btn){
  document.querySelectorAll('.pane').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
  document.getElementById(id).classList.add('on');btn.classList.add('on');
}

/* Annuaire des membres (données dans membres.js) */
// Dossiers essayés dans l'ordre pour trouver les photos
const PHOTO_DIRS=['assets/membres/','assets/membre/','assets/'];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const numOf=m=>(m.img.match(/\d+/)||[''])[0];
const label=m=>m.nom&&m.nom.trim()?m.nom:'Membre n°'+numOf(m);
const ini=m=>m.nom&&m.nom.trim()?m.nom.replace(/^(Dr|Maître)\s+/i,'').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase():numOf(m);

function renderGallery(list){
  const g=document.getElementById('gallery');if(!g||typeof promotion==='undefined')return;
  document.getElementById('count').textContent=list.length+' membre'+(list.length>1?'s':'');
  if(!list.length){g.innerHTML='<p class="empty">Aucun membre ne correspond à votre recherche.</p>';return;}
  g.innerHTML=list.map(m=>`<div class="card mcard"><img class="ph" src="${PHOTO_DIRS[0]}${esc(m.img)}" alt="${esc(label(m))}" loading="lazy" data-f="${esc(m.img)}" data-k="0" data-i="${esc(ini(m))}"><h3>${esc(label(m))}</h3>${m.description?`<p>${esc(m.description)}</p>`:''}</div>`).join('');
  g.querySelectorAll('img.ph').forEach(im=>im.addEventListener('error',()=>{const k=+im.dataset.k+1;if(k<PHOTO_DIRS.length){im.dataset.k=k;im.src=PHOTO_DIRS[k]+im.dataset.f;return;}const d=document.createElement('div');d.className='initials';d.textContent=im.dataset.i;im.replaceWith(d);}));
}

function filterMembers(){
  const q=document.getElementById('searchBox').value.toLowerCase().trim();
  renderGallery(promotion.filter(p=>label(p).toLowerCase().includes(q)||(p.description||'').toLowerCase().includes(q)||numOf(p)===q));
}

if(typeof promotion!=='undefined')renderGallery(promotion);

/* Formulaires → Envoi direct via WhatsApp */
document.querySelectorAll('form[data-subject]').forEach(f=>f.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(f);
  
  // Formatage propre du message pour WhatsApp
  let text = `*${f.dataset.subject}*\n\n`;
  [...d.entries()].forEach(([k,v])=>{
    text += `*${k}* : ${v}\n`;
  });
  
  // Création du lien d'ouverture WhatsApp
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  
  // Redirection vers WhatsApp
  window.open(waUrl, '_blank');
  
  const n=f.querySelector('.note');
  if(n){
    n.textContent='Redirection vers WhatsApp pour l’envoi du message…';
    n.classList.add('ok');
  }
}));