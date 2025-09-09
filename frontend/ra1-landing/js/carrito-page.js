import { isLoggedIn, currentUser }  from "./seesion-ui.js";

//Lógica Solo para carrito.html (render, sumar/restar/eliminar, total)

const cartKey = 'spa_cart';
const $body = document.getElementById('cartBody');
const $total = document.getElementById('cartTotal');
const $empty = document.getElementById('emptyState');
const $clear = document.getElementById('clearCart');
const $checkout = document.getElementById('checkout');
const $userHint = document.getElementById('cartUserHint');

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

// --- Toast local ---
function showToast(msg, variant = 'success') {
  const area = document.getElementById('toastArea');
  if (!area) return;
  const el = document.createElement('div');
  el.className = `toast align-items-center text-bg-${variant} border-0`;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-atomic', 'true');
  el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${msg}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
    </div>
  `;
  area.appendChild(el);
  new bootstrap.Toast(el, { delay: 1600 }).show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

function readCart(){
    try {
        return JSON.parse(localStorage.getItem(cartKey)) ?? [];
    } catch {
        return [];
    }
}

function writeCart(items) {
    localStorage.setItem(cartKey, JSON.stringify(items));
    // Actualiza badge
    const badge = document.getElementById('cartCount');
    if (badge) {
        const totalQty = items.reduce((acc, it) => acc + (it.qty || 1), 0);
        badge.textContent = totalQty;
        badge.style.display = 'inline-block';
    }
}

// Saludo y CTA
function setCartHeaderAndCTA() {
  if ($userHint) {
    if (isLoggedIn()) {
      const u = currentUser();
      $userHint.textContent = `— Hola, ${u?.nombre}`;
    } else {
      $userHint.textContent = '';
    }
  }

  if ($checkout) {
    if (isLoggedIn()) {
      $checkout.textContent = 'Proceder a pagar / reservar';
      $checkout.classList.remove('btn-outline-success');
      $checkout.classList.add('btn-success');
      // Por ahora en login a futuro a método de pago
      $checkout.setAttribute('href', '#'); // TODO: método de pago / confirmación
      // Para bloquear cuando no hay items:
      $checkout.toggleAttribute('disabled', readCart().length === 0);
    } else {
      $checkout.textContent = 'Iniciar sesión para reservar';
      $checkout.setAttribute('href', 'login.html');
      $checkout.removeAttribute('disabled');
      // Guardar retorno
      $checkout.addEventListener('click', () => {
        sessionStorage.setItem('afterLogin', 'carrito.html');
      }, { once: true });
    }
  }
}

// --- Render de fila ---

function rowHTML(it){
    const subtotal = (it.precio ||0) * (it.qty || 1);
    return `
    <tr data-sku="${it.sku}">
      <td>
        <div class="d-flex align-items-center gap-2">
          <div>
            <div class="fw-semibold">${it.nombre}</div>
            <div class="text-muted small">${it.sku}</div>
          </div>
        </div>
      </td>
      <td class="text-end">${CLP.format(it.precio || 0)}</td>
      <td class="text-center">
        <div class="btn-group" role="group" aria-label="Cantidad">
          <button class="btn btn-outline-secondary btn-sm btn-dec" title="Disminuir">–</button>
          <span class="px-3">${it.qty || 1}</span>
          <button class="btn btn-outline-secondary btn-sm btn-inc" title="Aumentar">+</button>
        </div>
      </td>
      <td class="text-end">${CLP.format(subtotal)}</td>
      <td class="text-center">
        <button class="btn btn-outline-danger btn-sm btn-del" title="Eliminar">
          <i class="bi bi-trash"></i><span class="ms-1 d-none d-md-inline">Eliminar</span>
        </button>
      </td>
    </tr>
  `;
}

//Render completo
function renderCart(){
    const items = readCart();

    //Estado vacío
    if(!items.length){
        $body.innerHTML = '';
        $total.textContent = CLP.format(0);
        $empty.classList.remove('d-none');
        $clear.setAttribute('disabled', 'true');
        return;
    }else {
        $empty.classList.add('d-none');
        $clear.removeAttribute('disabled');
    }

    //render filas
    $body.innerHTML = items.map(rowHTML).join('');


    //Total
    const total = items.reduce((acc, it) => acc + ((it.precio || 0) * (it.qty || 1)), 0);
    $total.textContent = CLP.format(total);
}

//---Utilidades---
function findItem(items,sku){
    return items.find(it => it.sku === sku);
}

//Delegación de eventos para botones +, -, eliminar
function handleActions(e){
    const btn = e.target.closest('button');
    if(!btn) return;

    const tr = btn.closest('tr[data-sku]');
    if(!tr) return;
    const sku = tr.dataset.sku?.trim();
    const items = readCart();
    const it = findItem(items, sku);
    if(!it) return;

    if(btn.classList.contains('btn-inc')){
        //Aumentar
        it.qty = (it.qty || 1) + 1;
        writeCart(items);
        renderCart();
    } else if(btn.classList.contains('btn-dec')){
        //Disminuir
        it.qty = Math.max(1, (it.qty || 1)- 1);
        if(it.qty <= 0) it.qty = 1;
        writeCart(items);
        renderCart();
    }else if(btn.classList.contains('btn-del')){
        //Eliminar
        const idx = items.findIndex(x => x.sku === sku);
        if(idx !== -1) items.splice(idx, 1);
        writeCart(items);
        renderCart();
        showToast(`Eliminado: ${it.nombre}`, 'warning');
    }
}

// Vaciar carrito
function handleClear(){
    if(!confirm('¿Vaciar el carrito?')) return;
    localStorage.setItem(cartKey, '[]');
    renderCart();
    showToast('Carrito vaciado', 'secondary');
}

//Init
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    if ($body)   $body.addEventListener('click', handleActions);
    if ($clear)  $clear.addEventListener('click', handleClear);
    setCartHeaderAndCTA();
});