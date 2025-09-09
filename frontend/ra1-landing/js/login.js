import { login } from './auth-mock.js';

//Utilidades: toast bootstrap
function showToast(msg, variant='success') {
    const area = document.getElementById('toastArea'); if (!area) return;
    const el = document.createElement('div');
    el.className = `toast align-items-center text-bg-${variant} border-0`;
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${msg}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" ></button>
    </div>
    `;
    area.appendChild(el);
    new bootstrap.Toast(el, { delay: 1600 }).show();
    el.addEventListener('hidden.bs.toast', () => { el.remove(); });
}

document.addEventListener('DOMContentLoaded', () => {
    const $form = document.getElementById('loginForm');
    const $email = document.getElementById('email');
    const $pass = document.getElementById('password');
    const $rem = document.getElementById('remember');
    const $toggle = document.getElementById('togglePassword');

    //Mostrar/ocultar pass
    if($toggle && $pass){
        $toggle.addEventListener('click', e => {
            const type = $pass.getAttribute('type') === 'password' ? 'text' : 'password';
            $pass.setAttribute('type', type);
            $toggle.classList.toggle('btn-outline-secondary');
            $toggle.classList.toggle('btn-outline-success');

        });
    }

    //Validar y enviar
    if($form){
        $form.addEventListener('submit', (e)=>{
            e.preventDefault();
            if (!$form.checkValidity()){
                $form.classList.add('was-validated');
                return;
            }
            const email =$email.value.trim();
            const pass = $pass.value;

            const res = login(email, pass, $rem?.checked);
            if(!res.ok){
                showToast('Correo o contraseña incorrectos', 'danger');
                $pass.value = '';
                $pass.focus();
                return;
            }

            //ok
            showToast(`Bienvenido/a, ${res.user.nombre}`, 'success');
            // Redirección: si venia del carrito, se devuelve al carrito

            const from = sessionStorage.getItem('afterLogin') || 'carrito.html';
            sessionStorage.removeItem('afterLogin');
            setTimeout(() => { window.location.href = from; }, 800);

        });
    }
});