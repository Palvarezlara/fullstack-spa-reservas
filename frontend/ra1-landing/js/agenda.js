// js/agenda.js

// ---- Datos mock de terapeutas ----
const TERAPEUTAS = [
  { id: 'vis', nombre: 'Viviana Schiappacasse' },
  { id: 'pim', nombre: 'Pamela Malicett' },
  { id: 'rcc', nombre: 'Rosa Cuevas' },
  { id: 'dch', nombre: 'Damari Campos' },
  { id: 'amm', nombre: 'Alicia Meza' },
];

// ---- Próximos 10 días ----
function nextDays(n = 10) {
  const out = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push(d);
  }
  return out;
}

// ---- Horarios mock ----
const SLOTS_AM = ['09:00', '10:00', '11:00', '12:00', '13:00'];
const SLOTS_PM = ['15:00', '16:00', '17:00', '18:00','19:00'];

// ---- Estado del modal ----
let agendaSku = null;
let agendaServicio = null;
let sel = { terapeuta: 'vis', fecha: null, hora: null };

// ---- Helpers ----
const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const $  = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

function chip(label, value, name, selected = false) {
  return `
    <input type="radio" class="btn-check" name="${name}" id="${name}-${value}" value="${value}" ${selected ? 'checked' : ''}>
    <label class="btn btn-outline-secondary btn-sm" for="${name}-${value}">${label}</label>
  `;
}

function dayChip(date, selected = false) {
  const di  = date.toLocaleDateString('es-CL', { weekday: 'short' });
  const d   = String(date.getDate()).padStart(2, '0');
  const m   = date.toLocaleDateString('es-CL', { month: 'short' });
  const val = date.toISOString().slice(0, 10);
  return `
    <input type="radio" class="btn-check" name="dia" id="dia-${val}" value="${val}" ${selected ? 'checked' : ''}>
    <label class="btn btn-outline-secondary btn-sm" for="dia-${val}">
      <div class="text-capitalize">${di}</div>
      <div class="fw-semibold">${d}</div>
      <div class="text-muted small">${m}</div>
    </label>
  `;
}

function slotBtn(hhmm, am = true) {
  const id = (am ? 'am-' : 'pm-') + hhmm.replace(':', '');
  return `<button type="button" id="${id}" class="btn btn-outline-secondary btn-sm slot" data-time="${hhmm}">${hhmm}</button>`;
}

function updateResumen() {
  const t = TERAPEUTAS.find(x => x.id === sel.terapeuta)?.nombre || '—';
  const s = sel.fecha ? sel.fecha : '—';
  const h = sel.hora  ? sel.hora  : '—';
  $('#resumen').textContent = `Terapeuta: ${t} · Día: ${s} · Hora: ${h}`;
  $('#btnContinuar').disabled = !(sel.terapeuta && sel.fecha && sel.hora);
}

// ---- Render del modal ----
function renderAgenda() {
  // Título y subtítulo
  $('#agendaTitulo').textContent   = agendaServicio?.nombre || 'Agendar';
  $('#agendaSubtitulo').textContent = `${CLP.format(agendaServicio?.precio || 0)} · ${agendaServicio?.categoria || ''}`;

  // Terapeutas
  const tHTML = TERAPEUTAS.map((t, i) => chip(t.nombre, t.id, 'terapeuta', i === 0)).join('');
  $('#terapeutas').innerHTML = tHTML;

  // Días (por defecto, hoy)
  const days  = nextDays(10);
  const dHTML = days.map((d, i) => dayChip(d, i === 0)).join('');
  $('#dias').innerHTML = dHTML;
  sel.fecha = days[0].toISOString().slice(0, 10);

  // Horas
  $('#slots-am').innerHTML = SLOTS_AM.map(h => slotBtn(h, true)).join('');
  $('#slots-pm').innerHTML = SLOTS_PM.map(h => slotBtn(h, false)).join('');
  sel.hora = null;

  updateResumen();
}

// ---- Eventos internos del modal ----
function bindAgendaEvents() {
  // Terapeuta
  $('#terapeutas').addEventListener('change', (e) => {
    if (e.target.name === 'terapeuta') {
      sel.terapeuta = e.target.value;
      updateResumen();
    }
  });

  // Día (nota: el contenedor es #dias, no #dia)
  $('#dias').addEventListener('change', (e) => {
    if (e.target.name === 'dia') {
      sel.fecha = e.target.value;
      updateResumen();
    }
  });

  // Hora (delegación)
  function onPickTime(e) {
    const btn = e.target.closest('.slot'); if (!btn) return;
    $$('.slot').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    sel.hora = btn.dataset.time;
    updateResumen();
  }
  $('#slots-am').addEventListener('click', onPickTime);
  $('#slots-pm').addEventListener('click', onPickTime);

  // Continuar → agrega al carrito local y navega a login
  $('#btnContinuar').addEventListener('click', () => {
    if ($('#btnContinuar').disabled) return;

    // addToCart local (módulos no comparten globals)
    const LS_KEY = 'spa_cart';
    const read  = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? []; } catch { return []; } };
    const write = (items) => {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
      const badge = document.getElementById('cartCount');
      if (badge) {
        const totalQty = items.reduce((acc, it) => acc + (it.qty || 1), 0);
        badge.textContent = totalQty;
        badge.style.display = 'inline-block';
      }
    };

    const items = read();
    const idx = items.findIndex(x => x.sku === agendaServicio.sku && JSON.stringify(x.agenda||{}) === JSON.stringify({terapeuta: sel.terapeuta, fecha: sel.fecha, hora: sel.hora}));
    if (idx !== -1) {
      items[idx].qty = (items[idx].qty || 1) + 1;
    } else {
      items.push({
        sku: agendaServicio.sku,
        nombre: agendaServicio.nombre,
        precio: agendaServicio.precio,
        qty: 1,
        agenda: { terapeuta: sel.terapeuta, fecha: sel.fecha, hora: sel.hora }
      });
    }
    write(items);

    const m = bootstrap.Modal.getInstance($('#agendaModal'));
    m?.hide();
    window.location.href = 'login.html';
  });
}

// ---- Abrir modal desde cualquier card (.btn-agendar) ----
function openAgendaForSKU(sku) {
  agendaSku = sku;
  agendaServicio = (window.SERVICIOS || []).find(s => s.sku === sku);
  if (!agendaServicio) { console.warn('SKU no encontrado', sku); return; }
  sel = { terapeuta: 'vis', fecha: null, hora: null };
  renderAgenda();
  new bootstrap.Modal($('#agendaModal')).show();
}

// ---- Delegación global para los botones Agendar ----
document.addEventListener('click', (e) => {
  const a = e.target.closest('.btn-agendar[data-sku]');
  if (!a) return;
  e.preventDefault();
  openAgendaForSKU(a.dataset.sku);
});

// ---- Init: bind eventos del modal cuando el DOM está listo ----
document.addEventListener('DOMContentLoaded', bindAgendaEvents);
