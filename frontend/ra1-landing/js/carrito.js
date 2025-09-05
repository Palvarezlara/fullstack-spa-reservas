console.log('[carrito.js] cargado');

//1) Config
const cartKey = 'spa_cart';

//2) Utilidades
function readCart() {
    try {
        return JSON.parse(localStorage.getItem(cartKey)) ?? [];
    } catch {
        return [];
    }
}

function writeCart(items) {
    localStorage.setItem(cartKey, JSON.stringify(items));
    renderCartCount(items);
}

//3) Agregar item al carrito
function addToCart(item) {
    const cart = readCart();
    // buscar si ya existe por sku
    const found = cart.find(p => p.sku === item.sku);
    if (found) {
        found.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    writeCart(cart);
    showToast(`Agregado: ${item.nombre}`);
}

//4) Toast Bootstrap
function showToast(msg) {
    const toastArea = document.getElementById('toastArea');
    const el = document.createElement('div');
    el.className = 'toast align-items-center text-bg-success border-0';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${msg}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
    </div>
  `;
    toastArea.appendChild(el);

    const toast = new bootstrap.Toast(el, { delay: 1600 }); //1.6s
    toast.show();
    // Limpiar cuando termine
    el.addEventListener('hidden.bs.toast', () => { el.remove(); });
}

//5) Contador en el navbar
function renderCartCount(items = readCart()) {
    const badge = document.getElementById('cartCount');
    if (!badge) return; //no existe
    const total = items.reduce((acc, it) => acc + it.qty, 0);
    badge.textContent = total;
    //badge.style.display = total > 0 ? 'inline-block' : 'none';
}

//6) Escucha clicks en btn "agregar"
function handleGlobalClicks(e) {
  // 1) Buscar cualquier elemento con data-sku (sirve para <button> o <a>)
  const trg = e.target.closest('[data-sku]');  // <-- closest (con s)
  if (!trg) return;

  // 2) Evitar que <a href="#"> salte arriba
  if (trg.tagName === 'A') e.preventDefault();

  // 3) Subir al .card para leer nombre y precio
  const card = trg.closest('.card');           // <-- closest (con s)
  if (!card) return;

  // 4) Datos del producto
  const sku = trg.dataset.sku?.trim();
  const nombre = card.querySelector('h3')?.textContent?.trim() || 'Servicio';
  const precioText = card.querySelector('.text-muted')?.textContent || '$0';
  const precio = Number(precioText.replace(/[^\d]/g, ''));

  if (!sku) return;

  addToCart({ sku, nombre, precio });
}


//7) Arranque
document.addEventListener('click', handleGlobalClicks);
document.addEventListener('DOMContentLoaded', () => renderCartCount());