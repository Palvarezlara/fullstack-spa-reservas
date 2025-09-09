// js/producto.js
import { SERVICIOS } from './data.js';

// Util
const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const $ = q => document.querySelector(q);

// Lee ?sku=XYZ
function getSKU() {
  const u = new URLSearchParams(window.location.search);
  return u.get('sku')?.trim();
}

const CAT_LABEL = {
  masajes: 'Masajes',
  corporales: 'Tratamientos corporales',
  circuitos: 'Circuitos & Sauna',
  individuales: 'Programas individuales',
  parejas: 'Programas en pareja',
  'escapada-amigas': 'Escapada de amigas'
};

// Pinta la ficha
function renderProducto(s) {
  // Breadcrumb / encabezado
  $('#bcCategoria').textContent = CAT_LABEL[s.categoria] || s.categoria || 'Categoría';
  $('#bcNombre').textContent = s.nombre;
  $('#prodTitle').textContent = s.nombre;
  const meta = [];
  if (s.duracionMin) meta.push(`${s.duracionMin} min`);
  if (s.categoriaLabel || s.categoria) meta.push(String(CAT_LABEL[s.categoria] || s.categoria ));
  $('#prodMeta').textContent = meta.join(' · ');

  // Ficha
  $('#prodImg').src = s.img;
  $('#prodImg').alt = s.nombre;
  $('#prodCategoria').textContent = CAT_LABEL[s.categoria] || s.categoria;
  $('#prodPrice').textContent = CLP.format(s.precio);
  $('#prodDesc').textContent = s.descripcion || 'Este servicio ofrece una experiencia de bienestar diseñada para relajar cuerpo y mente.';

  // Botones
  const btnAdd = $('#btnAdd');
  btnAdd.dataset.sku = s.sku;
  btnAdd.addEventListener('click', () => {
    // usa addToCart global de carrito.js
    if (typeof window.addToCart === 'function') {
      window.addToCart({ sku: s.sku, nombre: s.nombre, precio: s.precio, qty: 1 });
    } else {
      console.warn('addToCart no disponible');
    }
  });

  const btnAgenda = $('#btnAgenda');
  btnAgenda.dataset.sku = s.sku;
  btnAgenda.addEventListener('click', () => {
    // si agenda.js expone openAgendaForSKU, úsalo; si no, volvemos a productos y abrimos ahí
    if (typeof window.openAgendaForSKU === 'function') {
      window.openAgendaForSKU(s.sku);
    } else {
      window.location.href = `productos.html#${encodeURIComponent(s.categoria)}`;
    }
  });

  // Volver a su categoría
  const btnVolver = $('#btnVolver');
  btnVolver.href = `productos.html#${encodeURIComponent(s.categoria)}`;

  // Relacionados (misma categoría, hasta 3)
  const relRow = $('#relacionadosRow');
  if (relRow) {
    const relacionados = SERVICIOS
      .filter(x => x.categoria === s.categoria && x.sku !== s.sku)
      .slice(0, 3);

    relRow.innerHTML = relacionados.map(r => `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm">
          <img src="${r.img}" class="card-img-top" alt="${r.nombre}">
          <div class="card-body d-flex flex-column">
            <h3 class="h6">${r.nombre} <i class="bi bi-clock"></i></h3>
            <p class="text-muted mb-2">${CLP.format(r.precio)}</p>
            <div class="d-grid gap-2 mt-auto">
              <a class="btn btn-outline-success" href="producto.html?sku=${encodeURIComponent(r.sku)}">Ver detalle</a>
              <button class="btn btn-success btn-add" data-sku="${r.sku}">Agregar</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // listeners agregar en relacionados
    relRow.addEventListener('click', e => {
      const btn = e.target.closest('.btn-add[data-sku]');
      if (!btn) return;
      const it = SERVICIOS.find(x => x.sku === btn.dataset.sku);
      if (!it) return;
      if (typeof window.addToCart === 'function') {
        window.addToCart({ sku: it.sku, nombre: it.nombre, precio: it.precio, qty: 1 });
      }
    });
  }
}

function renderNotFound() {
  const c = document.querySelector('main .container');
  c.innerHTML = `
    <div class="alert alert-warning">
      No encontramos este servicio. <a href="productos.html" class="alert-link">Volver a servicios</a>.
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const sku = getSKU();
  const servicio = SERVICIOS.find(s => s.sku === sku);

  if (!sku || !servicio) {
    renderNotFound();
    return;
  }

  renderProducto(servicio);
});
