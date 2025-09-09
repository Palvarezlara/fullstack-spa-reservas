import { getSession, logout } from './auth-mock.js';

function renderAuthArea() {
    const authArea = document.getElementById('authArea');
    if (!authArea) return; // Si no existe el área de auth, salir

    const session = getSession();

    const cartBtn = authArea.querySelector('a.btn-outline-success.position-relative');

    if (!session) {
        //Estado no autenticado: mostrar botón Ingresar
        authArea.innerHTML = `
        <a class="btn btn-success" href="login.html">Ingresar</a>
        `;
        if (cartBtn) authArea.prepend(cartBtn); // reinsertar el carrito
        return;
    }


    //Estado autenticado: mostrar dropdown con nombre y cerrar sesión
    authArea.innerHTML = `
        <div class="dropdown">
        <button class="btn btn-outline-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            Hola, ${session.nombre}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#">Mi cuenta (próx.)</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" id="btnLogout">Cerrar sesión</button></li>
        </ul>
        </div>
    `;
    if (cartBtn) authArea.prepend(cartBtn); 

    //Logout
    const btn = document.getElementById('btnLogout');
    if (btn){
        btn.addEventListener('click', () => {
            logout();
            window.location.reload();
        });
    }
}

//Export útil en otras páginas
export function isLoggedIn() { return !!getSession();}
export function currentUser(){ return getSession();}

document.addEventListener('DOMContentLoaded', renderAuthArea);