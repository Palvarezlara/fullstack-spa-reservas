// === Utilidades ===
function showToast(msg, variant='success') {
  const area = document.getElementById('toastArea'); if (!area) return;
  const el = document.createElement('div');
  el.className = `toast align-items-center text-bg-${variant} border-0`;
  el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${msg}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  area.appendChild(el);
  new bootstrap.Toast(el, { delay: 1800 }).show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

// Solo letras (incluye tildes) y espacios, al menos 2 chars
const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,}$/;

// Requisito de la pauta: dominios permitidos
function isValidEmailDomain(email) {
  return /^[\w.%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(String(email));
}

document.addEventListener('DOMContentLoaded', () => {
  const $form = document.getElementById('contactForm');
  const $nombre = document.getElementById('nombre');
  const $email = document.getElementById('email');
  const $asunto = document.getElementById('asunto');
  const $mensaje = document.getElementById('mensaje');
  const $tyc = document.getElementById('tyc');
  const $count = document.getElementById('msgCount');

  // Contador de caracteres del mensaje
  const updateCount = () => { $count.textContent = String($mensaje.value.length); };
  $mensaje.addEventListener('input', updateCount);
  updateCount();

  // Validación en vivo (limpia errores custom)
  [$nombre, $email, $mensaje, $tyc].forEach($el => {
    $el.addEventListener('input', () => { $el.setCustomValidity(''); });
    $el.addEventListener('change', () => { $el.setCustomValidity(''); });
  });

  $form.addEventListener('submit', (e) => {
    e.preventDefault();

    let ok = true;

    // Nombre
    if (!NAME_RE.test($nombre.value.trim())) {
      $nombre.setCustomValidity('Nombre inválido');
      ok = false;
    }

    // Email
    if (!$email.checkValidity() || !isValidEmailDomain($email.value)) {
      $email.setCustomValidity('Dominio no permitido');
      ok = false;
    }

    // Mensaje
    if (!$mensaje.value.trim().length || $mensaje.value.length > 500) {
      $mensaje.setCustomValidity('Mensaje inválido');
      ok = false;
    }

    // Términos
    if (!$tyc.checked) {
      $tyc.setCustomValidity('Debes aceptar');
      ok = false;
    }

    if (!ok || !$form.checkValidity()) {
      $form.classList.add('was-validated');
      return;
    }

    // Guardar último contacto en LS para demo/traza
    try {
      const payload = {
        nombre: $nombre.value.trim(),
        email: $email.value.trim(),
        asunto: $asunto.value.trim(),
        mensaje: $mensaje.value.trim(),
        ts: new Date().toISOString()
      };
      const prev = JSON.parse(localStorage.getItem('spa_contact_msgs') || '[]');
      prev.push(payload);
      localStorage.setItem('spa_contact_msgs', JSON.stringify(prev));
    } catch {}

    showToast('¡Mensaje enviado! Te contactaremos pronto.', 'success');

    // Reset limpio
    $form.reset();
    $form.classList.remove('was-validated');
    updateCount();
  });
});