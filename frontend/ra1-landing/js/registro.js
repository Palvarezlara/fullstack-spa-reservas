import {LS_USERS, LS_SESSION} from './auth-mock.js';

//Toast de Bootstrap
function showToast(msg, variant = 'success'){
    const area = document.getElementById('toastArea');
    if(!area) return;
    const el = document.createElement('div');
    el.className = `toast align-items-center text-bg-${variant} border-0`;
    el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${msg}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
    area.appendChild(el);
    new bootstrap.Toast(el, {delay: 2000}).show();
    el.addEventListener('hidden.bs.toast', () => el.remove());
}

//Dominio de correo permitido según pauta (duoc.cl, profesor.duoc.cl, gmail.com)
function isValidEmailDomain(email){
    return /^[\w.%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(String(email));
}

// Teléfono chileno: sacamos no-dígitos y pedimos 9–11 dígitos
function normalizePhone(str) {
  return String(str).replace(/\D+/g, '');
}

function isValidPhoneCL(str) {
  const digits = normalizePhone(str);
  return digits.length >= 9 && digits.length <= 11;
}

document.addEventListener('DOMContentLoaded', () => {
  const $form = document.getElementById('registerForm');
  const $nombre = document.getElementById('nombre');
  const $apellido = document.getElementById('apellido');
  const $email = document.getElementById('email');
  const $pass = document.getElementById('password');
  const $pass2 = document.getElementById('password2');
  const $tel = document.getElementById('telefono');
  const $region = document.getElementById('region');
  const $comuna = document.getElementById('comuna');

  // reset de errores custom al escribir
  [$email, $pass2].forEach($i => $i.addEventListener('input', () => $i.setCustomValidity('')));

  $form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validaciones HTML5 + custom
    let ok = true;

    if (!$form.checkValidity()) ok = false;

    if (!isValidEmailDomain($email.value)) {
      $email.setCustomValidity('Dominio no permitido');
      ok = false;
    } else {
      $email.setCustomValidity('');
    }

    if ($pass.value !== $pass2.value) {
      $pass2.setCustomValidity('Las contraseñas no coinciden');
      ok = false;
    } else {
      $pass2.setCustomValidity('');
    }

    if (!isValidPhoneCL($tel.value)) {
      $tel.setCustomValidity('Teléfono inválido');
      ok = false;
    } else {
      $tel.setCustomValidity('');
    }

    if (!ok) {
      $form.classList.add('was-validated');
      return;
    }

    // Leer usuarios actuales
    const users = JSON.parse(localStorage.getItem(LS_USERS) || '[]');

    // Evitar duplicados por email
    if (users.some(u => u.email.toLowerCase() === $email.value.trim().toLowerCase())) {
      showToast('Este correo ya está registrado.', 'danger');
      return;
    }

    // Crear usuario
    const user = {
      id: Date.now(),
      nombre: $nombre.value.trim(),
      apellido: $apellido.value.trim(),
      email: $email.value.trim(),
      pass: $pass.value, // solo para demo; en real, hashear
      telefono: normalizePhone($tel.value),
      region: $region.value,
      comuna: $comuna.value,
      rol: 'cliente'
    };

    users.push(user);
    localStorage.setItem(LS_USERS, JSON.stringify(users));

    // Iniciar sesión
    const session = { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
    localStorage.setItem(LS_SESSION, JSON.stringify(session));

    showToast(`¡Registro exitoso, ${user.nombre}!`, 'success');

    // Redirigue: si venía desde el carrito, volver; si no, al Home
    const after = sessionStorage.getItem('afterLogin') || 'index.html';
    sessionStorage.removeItem('afterLogin');
    setTimeout(() => window.location.href = after, 800);
  });
});