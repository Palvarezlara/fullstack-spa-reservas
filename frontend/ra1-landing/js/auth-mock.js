
//Simulación simple de usuarios y sesión con localStorage

export const LS_USERS = 'spa_users';
export const LS_SESSION = 'spa_session';

//1) Usuarios "registrados"
const seedUsers = [
  { id: 1, email: 'vip@spa.com', pass: 'vip123', nombre: 'Cliente VIP', rol: 'vip' },
  { id: 2, email: 'cliente@spa.com', pass: 'cliente123', nombre: 'Cliente Regular', rol: 'cliente' },
  // para futuro: admins, jefatura, terapeutas etc.
];

//2) Asegurar que haya datos en LS
function ensureSeed(){
    const stored = JSON.parse(localStorage.getItem(LS_USERS) || '[]');
    if(!stored.length) localStorage.setItem(LS_USERS, JSON.stringify(seedUsers));
}
ensureSeed();

//3) Buscar usuario por email (login)
export function findUserByEmail(email){
    const users = JSON.parse(localStorage.getItem(LS_USERS) || '[]');
    return users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
}

//4) Hacer login (crear sesión)
export function login(email, pass, remember=false){
    const user = findUserByEmail(email);
    if(!user || user.pass !== pass) return {ok: false, error: 'Email o contraseña incorrectos'};

    const session = {id: user.id, email: user.email, nombre: user.nombre, rol: user.rol, ts: Date.now() };
    localStorage.setItem(LS_SESSION, JSON.stringify(session));

    // Para recordar el email en el login
    if(remember) localStorage.setItem(LS_SESSION+'_remember','1');
    else localStorage.removeItem(LS_SESSION+'_remember');

    return {ok:true, user: session};
}

//5) getSession: retorna datos de la sesión o null
export function getSession(){
    try{ return JSON.parse(localStorage.getItem(LS_SESSION)); } catch(e) { return null; }
}

//6) logout: elimina la sesión
export function logout(){
    localStorage.removeItem(LS_SESSION);
    localStorage.removeItem(LS_SESSION+'_remember');
}