import { SERVICES } from './data.js';
import { openAuthModal } from './auth.js';

export function renderServicios() {
  const cont = document.querySelector('#servicios');
  cont.innerHTML = SERVICES.filter(s => s.activo).map(s => `
    <article class="card">
      <h3>${s.nombre}</h3>
      <p>Duración: ${s.duracionMin} min</p>
      <p>$${s.precio.toLocaleString('es-CL')}</p>
      <button data-service="${s.id}" class="btn-reservar">Reservar</button>
    </article>
  `).join('');
  cont.addEventListener('click', (e)=>{
    const btn = e.target.closest('.btn-reservar');
    if (!btn) return;
    const serviceId = Number(btn.dataset.service);
    openAuthModal({ serviceId }); // delega a auth: login/registro/invitado
  }, { once: true });
}

export function renderGaleria() {
  const urls = [
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
    'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba',
    'https://images.unsplash.com/photo-1584982751601-97dcc096659c',
    // agrega 3–6 más
  ];
  document.querySelector('#galeria').innerHTML = urls.map(u =>
    `<img src="${u}?auto=format&fit=crop&w=800&q=60" alt="Ambiente del SPA">`
  ).join('');
}
