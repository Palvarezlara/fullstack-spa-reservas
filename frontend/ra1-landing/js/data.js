// Datos de los servicios, luego esto van a ir en la base de datos / API
const SERVICES = [
    { "id": 1, "nombre": "Masaje de Relajación", "duracionMin": 60, "precio": 28000, "activo": true },
  { "id": 2, "nombre": "Masaje Descontracturante", "duracionMin": 60, "precio": 32000, "activo": true },
  { "id": 3, "nombre": "Masaje Piedras Calientes", "duracionMin": 70, "precio": 38000, "activo": true },
  { "id": 4, "nombre": "Masaje Drenaje Linfático", "duracionMin": 60, "precio": 35000, "activo": true },
  { "id": 5, "nombre": "Masaje Reductivo", "duracionMin": 60, "precio": 36000, "activo": false },
  { "id": 6, "nombre": "Masaje de Espalda", "duracionMin": 20, "precio": 18000, "activo": true },
  { "id": 7, "nombre": "Masaje Craneal", "duracionMin": 30, "precio": 15000, "activo": true },
  { "id": 8, "nombre": "Reflexología Podal", "duracionMin": 45, "precio": 22000, "activo": true },
  { "id": 9, "nombre": "Exfoliación Corporal + Hidratación", "duracionMin": 50, "precio": 28000, "activo": true },
  { "id": 10, "nombre": "Tratamiento Facial Hidratante", "duracionMin": 45, "precio": 25000, "activo": false },
  { "id": 11, "nombre": "Tratamiento Facial Anti-Edad", "duracionMin": 60, "precio": 32000, "activo": true },
  { "id": 12, "nombre": "Limpieza Facial Profunda", "duracionMin": 60, "precio": 30000, "activo": false }
];

// Galería de imágenes
const GALLERY = [
  { url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2', alt: 'Recepción y ambiente' },
  { url: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba', alt: 'Sala de masaje' },
  { url: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c', alt: 'Zona de descanso' },
  { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03', alt: 'Esencias y aceites' },
  { url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874', alt: 'Toallas y detalles' },
  { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba', alt: 'Ambiente relajante' },
];

// Utilidades
const $ = (selector) => document.querySelector(selector);
const CLP = (n) => `$${n.toLocaleString('es-CL')}`;

// 3) Render de Servicios
function renderServicios() {
  const cont = $('#servicios');
  cont.innerHTML = SERVICES
    .filter(s => s.activo)
    .map(s => `
      <article class="card">
        <h3>${s.nombre}</h3>
        <p>Duración: ${s.duracionMin} min</p>
        <p class="price">${CLP(s.precio)}</p>
        <button class="btn-reservar" data-service="${s.id}">Reservar</button>
      </article>
    `).join('');

  // Delegación de eventos: escucha un solo click en el contenedor
  cont.addEventListener('click', onReservarClick, { once: true });
}

function onReservarClick(e) {
  const btn = e.target.closest('.btn-reservar');
  if (!btn) return; // click fuera de botones
  const serviceId = Number(btn.dataset.service);

  // Guardamos el servicio elegido para el siguiente paso (modal)
  sessionStorage.setItem('serviceToBook', String(serviceId));

  // Placeholder de aprendizaje:
  // En el Paso 2 abriremos un modal para login/registro/invitado.
  alert('Perfecto. En el próximo paso abriremos el modal de autenticación.\nServicio ID: ' + serviceId);

  // Tip: si quieres que el listener siga funcionando para más clicks:
  e.currentTarget.addEventListener('click', onReservarClick, { once: true });
}

// 4) Render de Galería
function renderGaleria() {
  const cont = $('#galeria');
  cont.innerHTML = GALLERY.map(img =>
    `<img src="${img.url}?auto=format&fit=crop&w=800&q=60" alt="${img.alt}">`
  ).join('');
}

// 5) Arranque
document.addEventListener('DOMContentLoaded', () => {
  renderServicios();
  renderGaleria();
});