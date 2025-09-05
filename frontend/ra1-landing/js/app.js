// js/app.js
import { SERVICIOS } from './data.js';

// Selecciona contenedores por categoría (usa los IDs de productos.html)
const $masajes      = document.querySelector('#masajes .row');
const $corporales   = document.querySelector('#corporales .row');
const $circuitos    = document.querySelector('#circuitos .row');
const $individuales = document.querySelector('#individuales .row');
const $parejas      = document.querySelector('#parejas .row');
const $amigas       = document.querySelector('#escapada-amigas .row');

const mapCatToEl = {
  'masajes': $masajes,
  'corporales': $corporales,
  'circuitos': $circuitos,
  'individuales': $individuales,
  'parejas': $parejas,
  'escapada-amigas': $amigas
};

// Función que devuelve el HTML de UNA card
function cardHTML({ sku, nombre, precio, img }) {
  const precioCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(precio);
  return `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <img src="${img}" class="card-img-top" alt="${nombre}">
        <div class="card-body d-flex flex-column">
          <h3 class="h6">${nombre}</h3>
          <p class="text-muted mb-2">${precioCLP}</p>
          <a href="producto.html" class="btn btn-outline-success mt-auto">Ver detalle</a>
          <button class="btn btn-success mt-2" data-sku="${sku}">Agregar</button>
        </div>
      </div>
    </div>
  `;
}

// Renderiza todas las categorías
function renderCategorias() {
  // Limpia contenedores por si recargas o vuelves a pintar
  Object.values(mapCatToEl).forEach(el => el && (el.innerHTML = ''));

  for (const servicio of SERVICIOS) {
    const cont = mapCatToEl[servicio.categoria];
    if (!cont) continue; // si no hay contenedor, salta
    cont.insertAdjacentHTML('beforeend', cardHTML(servicio));
  }
}

function renderDestacados() {
  const $dest = document.querySelector('#destacados .row');
  if (!$dest) return;
  const SKUS = ["BOSQUE60","PIED60","OLIVO90"]; 
  const items = SERVICIOS.filter(s => SKUS.includes(s.sku));

  $dest.innerHTML = '';
  for (const s of items) {
    $dest.insertAdjacentHTML('beforeend', `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm">
          <img src="${s.img}" class="card-img-top" alt="${s.nombre}">
          <div class="card-body d-flex flex-column">
            <h3 class="h6">${s.nombre}</h3>
            <p class="text-muted mb-2">${new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(s.precio)}</p>
            <a href="producto.html" class="btn btn-outline-success mt-auto">Ver detalle</a>
            <button class="btn btn-success mt-2" data-sku="${s.sku}">Agregar</button>
          </div>
        </div>
      </div>
    `);
  }
}
// Arranque
document.addEventListener('DOMContentLoaded', renderCategorias);
document.addEventListener('DOMContentLoaded', renderDestacados);
